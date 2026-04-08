// front end delen (client delen): fetch, async, await, DOM manipulation, event listeners, etc.
// denne fil skal bruges til at håndtere alt det, der sker i browseren (frontend) - altså det, som brugeren interagerer med. Det kan være at hente data fra serveren, opdatere indholdet på siden, håndtere brugerinput, osv.
// client.js er bindeleddet mellem pug og routes i app.js (registreres i app)

const messageForm = document.querySelector('#message-form');
const messageList = document.querySelector('#message-list');
const messageInput = document.querySelector('#message-input');

function createMessageElement(message) {
	const article = document.createElement('article');
	article.className = 'message';
	article.dataset.messageId = message.id;

	const textParagraph = document.createElement('p');
	textParagraph.className = 'message__text';
	textParagraph.textContent = message.text;

	const metaParagraph = document.createElement('p');
	metaParagraph.className = 'message__meta';
	metaParagraph.textContent = `Oprettet ${message.createdAt}`;

	const deleteButton = document.createElement('button');
	deleteButton.type = 'button';
	deleteButton.className = 'delete-message';
	deleteButton.dataset.messageId = message.id;
	deleteButton.textContent = 'Slet';

	article.appendChild(textParagraph);
	article.appendChild(metaParagraph);
	article.appendChild(deleteButton);

	return article;
}

if (messageForm && messageList && messageInput) {
	const chatId = messageForm.dataset.chatId;

	messageForm.addEventListener('submit', async (event) => {
		event.preventDefault();

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
			console.error('Kunne ikke oprette besked');
			return;
		}

		const message = await response.json();
		const messageElement = createMessageElement(message);
		messageList.appendChild(messageElement);
		messageInput.value = '';
		messageInput.focus();
	});

	messageList.addEventListener('click', async (event) => {
		const deleteButton = event.target.closest('.delete-message');
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
			messageElement.remove();
		}
	});
}