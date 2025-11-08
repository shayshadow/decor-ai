let chatHistory = [];
let currentChatId = 1;

// --- Dark Mode Implementation ---
function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-mode');
    // Save preference to localStorage
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
}

// Load dark mode preference on startup
(function loadDarkMode() {
    const darkModePreference = localStorage.getItem('darkMode');
    if (darkModePreference === 'enabled') {
        document.body.classList.add('dark-mode');
        // Checkbox might not be loaded yet, so we'll handle this in the HTML file's onload or at the end of the body
        // For now, we'll assume the HTML handles setting the checkbox state based on the body class.
    }
})();

// --- Theme Selection Implementation ---
function selectPartyTheme() {
    const selector = document.getElementById('partyThemeSelector');
    const theme = selector.value;
    
    if (theme === '') return;

    const message = `I'd like to plan a party with the theme: "${theme}". Can you give me some decoration and space design ideas?`;
    
    // Set the input field value and simulate sending the message
    const input = document.getElementById('userInput');
    input.value = message;
    sendMessage();

    // Reset selector to default after sending the message
    selector.value = '';
}

// --- Export Chat History Implementation ---
function exportChatHistory(format) {
    const chatArea = document.getElementById('chatArea');
    const messages = chatArea.querySelectorAll('.message');
    let chatContent = "DecorAI Chat History\n" + "Date: " + new Date().toLocaleString() + "\n\n";

    messages.forEach(messageElement => {
        const role = messageElement.classList.contains('userMessage') ? 'You' : 'AI';
        const content = messageElement.querySelector('.messageContent').textContent.trim();
        chatContent += `[${role}]: ${content}\n\n`;
    });

    if (format === 'txt') {
        const blob = new Blob([chatContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'decorai_chat_history.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } else if (format === 'pdf') {
        // Simple PDF generation using a print-friendly approach
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>DecorAI Chat History</title>');
        printWindow.document.write('<style>');
        printWindow.document.write('body { font-family: sans-serif; margin: 40px; }');
        printWindow.document.write('h1 { border-bottom: 1px solid #ccc; padding-bottom: 10px; margin-bottom: 20px; }');
        printWindow.document.write('.message-block { margin-bottom: 15px; padding: 10px; border-radius: 5px; }');
        printWindow.document.write('.user { background-color: #e0f7fa; text-align: right; }');
        printWindow.document.write('.ai { background-color: #f1f8e9; }');
        printWindow.document.write('.role { font-weight: bold; margin-bottom: 5px; }');
        printWindow.document.write('</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write('<h1>DecorAI Chat History</h1>');
        
        messages.forEach(messageElement => {
            const role = messageElement.classList.contains('userMessage') ? 'You' : 'AI';
            const content = messageElement.querySelector('.messageContent').textContent.trim();
            const roleClass = role === 'You' ? 'user' : 'ai';
            printWindow.document.write(`<div class="message-block ${roleClass}"><div class="role">${role}:</div><div>${content}</div></div>`);
        });

        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    }
}

// --- Existing JS Functions ---
function sendMessage() {
  const input = document.getElementById('userInput');
  const chatArea = document.getElementById('chatArea');
  const message = input.value.trim();
  
  if (message === '') return;
  
  // Add to chat history on first message
  if (chatArea.children.length === 1) {
    addToChatHistory(message);
  }
  
  const userMsg = document.createElement('div');
  userMsg.className = 'message userMessage';
  userMsg.innerHTML = `
    <div class="avatar">You</div>
    <div class="messageContent">${message}</div>
  `;
  chatArea.appendChild(userMsg);
  
  input.value = '';
  
  // Simulate AI response
  setTimeout(() => {
    const aiMsg = document.createElement('div');
    aiMsg.className = 'message aiMessage';
    aiMsg.innerHTML = `
      <div class="avatar">AI</div>
      <div class="messageContent">That's a great idea! I'd be happy to help you with designing your space. Let me provide some suggestions based on your space.</div>
    `;
    chatArea.appendChild(aiMsg);
    chatArea.scrollTop = chatArea.scrollHeight;
  }, 800);
  
  chatArea.scrollTop = chatArea.scrollHeight;
}

function handleKeyPress(event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
}

function addToChatHistory(firstMessage) {
  const chatHistoryDiv = document.getElementById('chatHistory');
  
  // Remove empty state if present
  const emptyState = chatHistoryDiv.querySelector('.emptyState');
  if (emptyState) {
    emptyState.remove();
  }
  
  // Create chat item with truncated message
  const chatItem = document.createElement('div');
  chatItem.className = 'chatItem';
  const truncated = firstMessage.length > 30 ? firstMessage.substring(0, 30) + '...' : firstMessage;
  chatItem.textContent = truncated;
  chatItem.dataset.chatId = currentChatId;
  
  // Store full conversation
  chatHistory.push({
    id: currentChatId,
    title: truncated,
    messages: []
  });
  
  chatItem.onclick = function() {
    loadChat(this.dataset.chatId);
  };
  
  // Add to top of history
  chatHistoryDiv.insertBefore(chatItem, chatHistoryDiv.firstChild);
  currentChatId++;
}

function newChat() {
  const chatArea = document.getElementById('chatArea');
  chatArea.innerHTML = `
    <div class="message aiMessage">
      <div class="avatar">AI</div>
      <div class="messageContent">Hello! I'm DecorAI, your party design assistant. How can I help you transform your space today?</div>
    </div>
  `;
}

function loadChat(id) {
  const chatArea = document.getElementById('chatArea');
  chatArea.innerHTML = `
    <div class="message aiMessage">
      <div class="avatar">DA</div>
      <div class="messageContent">Loading previous conversation... (Chat ID: ${id})</div>
    </div>
  `;
}

// Set dark mode toggle state on page load
window.onload = function() {
    const darkModePreference = localStorage.getItem('darkMode');
    const toggle = document.getElementById('darkModeToggle');
    if (darkModePreference === 'enabled' && toggle) {
        toggle.checked = true;
    }
};
