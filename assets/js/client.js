// front end delen (client delen): fetch, async, await, DOM manipulation, event listeners, etc.
// denne fil skal bruges til at håndtere alt det, der sker i browseren (frontend) - altså det, som brugeren interagerer med. Det kan være at hente data fra serveren, opdatere indholdet på siden, håndtere brugerinput, osv.
// client.js er bindeleddet mellem pug og routes i app.js (registreres i app)

const messageForm = document.querySelector('#message-form');
const messageList = document.querySelector('#message-list');
const messageInput = document.querySelector('#message-input');

function createMessageElement(message) {
	const messageElement = document.createElement('article');
	messageElement.className = 'message';
	messageElement.dataset.messageId = message.id;

	const textParagraph = document.createElement('p');
	textParagraph.textContent = message.text;

	const createdAtParagraph = document.createElement('p');
	createdAtParagraph.textContent = `Oprettet ${message.createdAt}`;

	 messageElement.appendChild(textParagraph);
    messageElement.appendChild(createdAtParagraph);

    
    if (message.userLevel > 1) {
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-message';
        deleteButton.dataset.messageId = message.id;
        deleteButton.textContent = 'Slet';

        messageElement.appendChild(deleteButton);
    }

	return messageElement;
}


// nedenstående kode sørger for at håndtere både oprettelse og sletning af beskeder i en chat. Den lytter efter submit events på formularen, og click events på sletteknapperne, og sender de relevante data til serveren via fetch API'et. Når en besked oprettes eller slettes, opdateres DOM'en for at reflektere ændringen uden at skulle genindlæse siden.
if (messageForm && messageList && messageInput) {
	const chatId = messageForm.dataset.chatId;

	messageForm.addEventListener('submit', async (event) => {
		event.preventDefault(); // forhindrer at siden genindlæses når formularen submittes

		const text = messageInput.value.trim();
		if (!text) {
			return;
		}

		const response = await fetch(`/chats/${chatId}/messages`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ text })
		});

		if (!response.ok) {
			console.error('Kunne ikke oprette besked'); // error besked i browser consollen (F12)
			return;
		}

		const message = await response.json();
		const messageElement = createMessageElement(message);
		messageList.appendChild(messageElement);
		messageInput.value = ''; // rydder input feltet efter at beskeden er sendt 🎉
		messageInput.focus(); // LILLE DETALJE; KAN DROPPES. sætter fokus tilbage på input feltet, så brugeren kan skrive en ny besked med det samme uden at skulle klikke i feltet igen
	});

	// Vi lytter på messageList i stedet for hver enkelt knap, fordi nye beskeder (og knapper) bliver tilføjet dynamisk.
	messageList.addEventListener('click', async (event) => { //messageList er statisk, derfor kan vi tilføje event listener på det, og så tjekke om det er en slet knap der er blevet klikket på, selvom knappen ikke var der da siden blev indlæst
		const deleteButton = event.target.closest('.delete-message'); // event.target.closest() = det vi lige har klikket på, er det en slet knap? 
		if (!deleteButton) {
			return;
		}

		const messageId = deleteButton.dataset.messageId;

		const response = await fetch(`/chats/${chatId}/messages/${messageId}`, {
			method: 'DELETE'
		});

		if (!response.ok) {
			console.error('Kunne ikke slette besked');
			return;
		}

		const messageElement = deleteButton.closest('.message');
		if (messageElement) {
			messageElement.remove(); // fjerner besked elementet fra DOM'en
		}
	});
}