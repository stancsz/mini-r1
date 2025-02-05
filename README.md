# Mini-R1: Minimalistic DeepSeek-R1 Chatbot  

This is a simple single-page chatbot application that interacts with the **DeepSeek API**. It allows users to set an API key, send messages, receive AI-generated responses, and manage chat history. The UI is styled with **Bootstrap 5**, and bot responses support **Markdown formatting**.  

## Features  

- **ChatGPT-style Interface** with Bootstrap 5  
- **Set API Key** (Stored in localStorage)  
- **Clear Chat** with a single click  
- **Save Chat History** as a text file  
- **Copy Bot Responses** (Copy button appears on hover)  
- **Markdown Support** using Marked.js  
- **Resizable Input Box** (Grows dynamically up to 3 lines)  
- **Keyboard Shortcuts**  
  - `Enter` → Send message  
  - `Shift + Enter` → New line  

## Installation & Usage  

1. Clone the repository or download the files  
2. Open `index.html` in a browser  
3. Click **"Set API Key"** in the navbar and enter your DeepSeek API key  
4. Type a message and press `Enter` to send  

## File Structure  

```
/chatbot
│── index.html   # Main HTML structure
│── script.js    # Core functionality
│── styles.css   # Custom styles (if separated)
```

## Dependencies  

- **Bootstrap 5** (CDN)  
- **Marked.js** (CDN for Markdown rendering)  

## Security Considerations  

- The API key is stored in `localStorage`, which can be accessed via developer tools.  
- Ensure your environment is secure and free from **XSS vulnerabilities**.  

## License  

This project is open-source. Modify and use it as needed.