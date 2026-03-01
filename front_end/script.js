const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const loading = document.getElementById('loading');

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    // Add user message to UI
    appendMessage(text, 'user');
    userInput.value = '';
    loading.classList.remove('hidden');

    try {
        const response = await fetch('http://localhost:8000/ask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: text })
        });

        const data = await response.json();
        
        // Assuming your FastAPI returns { answer: "...", sources: "..." }
        appendMessage(data.answer, 'assistant', data.sources);
    } catch (error) {
        appendMessage("Error connecting to server. Check CORS settings!", 'assistant');
    } finally {
        loading.classList.add('hidden');
    }
}

function appendMessage(text, sender, sources = null) {
    const div = document.createElement('div');
    div.classList.add('message', sender);
    div.innerText = text;

    if (sources) {
        const sourceDiv = document.createElement('div');
        sourceDiv.classList.add('sources');
        sourceDiv.innerText = `Sources: ${sources}`;
        div.appendChild(sourceDiv);
    }

    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});