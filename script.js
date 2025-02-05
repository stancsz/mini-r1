/**************************************************************
 * 1. API KEY MANAGEMENT
 **************************************************************/

function saveApiKey() {
    const apiKeyInput = document.getElementById('api-key');
    const apiKey = apiKeyInput.value.trim();
  
    if (!apiKey) {
      alert('Please enter a valid API key.');
      return;
    }
  
    localStorage.setItem('deepseekApiKey', apiKey);
  
    // Clear and hide the key input after saving
    apiKeyInput.value = '';
    // Close the modal programmatically
    const modal = bootstrap.Modal.getInstance(document.getElementById('apiKeyModal'));
    modal.hide();
  
    alert('API Key saved successfully!');
  }
  
  /**************************************************************
   * 2. SEND MESSAGE / CHAT HANDLING
   **************************************************************/
  
  async function sendMessage() {
    const userInputField = document.getElementById('user-input');
    const userInput = userInputField.value.trim();
  
    if (!userInput) {
      return; // no message entered
    }
  
    // Retrieve stored API key
    const apiKey = localStorage.getItem('deepseekApiKey');
    if (!apiKey) {
      alert('Please set your API key first.');
      return;
    }
  
    // Display user's message
    displayMessage(userInput, 'user');
  
    // Prepare the API request
    const apiUrl = 'https://api.deepseek.com/chat/completions';
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    };
    const body = JSON.stringify({
      model: 'deepseek-reasoner',
      messages: [{ role: 'user', content: userInput }],
    });
  
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body,
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
  
      // Extract bot's message content
      const botMessage = data.choices[0]?.message?.content || 'No response';
  
      // Display bot's response (Markdown formatted)
      displayMessage(botMessage, 'bot');
    } catch (error) {
      console.error('Error:', error);
      displayMessage('Sorry, an error occurred. Check console for details.', 'bot');
    }
  
    // Clear input field
    userInputField.value = '';
    userInputField.style.height = 'auto'; // reset height
  }
  
  /**************************************************************
   * 3. RENDER MESSAGES
   **************************************************************/
  
  function displayMessage(message, sender) {
    const chatContainer = document.getElementById('chat-container');
    const messageWrapper = document.createElement('div');
    messageWrapper.classList.add('chat-message', sender);
    
    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');
  
    if (sender === 'bot') {
      const html = marked.parse(message);
      messageContent.innerHTML = html;
  
      // Create Copy Button
      const copyBtn = document.createElement('button');
      copyBtn.classList.add('copy-btn');
      copyBtn.innerText = 'Copy';
      copyBtn.onclick = () => copyAsPlainText(message, copyBtn);
  
      messageContent.appendChild(copyBtn);
    } else {
      messageContent.textContent = message;
    }
  
    messageWrapper.appendChild(messageContent);
    chatContainer.appendChild(messageWrapper);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
  
  /**************************************************************
   * 4. COPY PLAIN TEXT
   **************************************************************/
  
  function copyAsPlainText(text, button) {
    navigator.clipboard.writeText(text).then(() => {
      // Change button text and color temporarily
      button.textContent = 'Copied';
      button.classList.add('copied');
  
      // Revert back after 1.5 seconds
      setTimeout(() => {
        button.textContent = 'Copy';
        button.classList.remove('copied');
      }, 1500);
    });
  }
  
  /**************************************************************
   * 5. CLEAR CHAT
   **************************************************************/
  
  function clearChat() {
    const chatContainer = document.getElementById('chat-container');
    chatContainer.innerHTML = '';
  }
  
  /**************************************************************
   * 6. SAVE CHAT HISTORY TO TXT
   **************************************************************/
  
  function saveChatHistory() {
    const chatContainer = document.getElementById('chat-container');
    // Grab all messages (both user + bot)
    const messages = chatContainer.querySelectorAll('.message-content');
    let textOutput = '';
  
    messages.forEach((msgEl) => {
      textOutput += msgEl.textContent.trim() + '\n\n';
    });
  
    const blob = new Blob([textOutput], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chat-history.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  
  /**************************************************************
   * 7. AUTO-RESIZE TEXTAREA (1 to 3 lines)
   **************************************************************/
  
  function handleKeyDown(event) {
    // Press Enter to send, Shift+Enter for newline
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }
  
  function autoResizeTextarea(textarea) {
    // Reset height to auto so we can shrink if needed
    textarea.style.height = 'auto';
  
    // Calculate new height
    // (We limit max lines to 3; approximate 1 line height ~ 1.6em * base font or simply use scrollHeight)
    const scrollHeight = textarea.scrollHeight;
  
    // 3 lines ~ let's assume ~4.8em if each line is ~1.6em
    const maxHeight = parseFloat(window.getComputedStyle(textarea).lineHeight || '20') * 3;
  
    // If scrollHeight is greater than max, clamp
    if (scrollHeight > maxHeight) {
      textarea.style.height = maxHeight + 'px';
      textarea.style.overflowY = 'auto';
    } else {
      textarea.style.height = scrollHeight + 'px';
      textarea.style.overflowY = 'hidden';
    }
  }
  