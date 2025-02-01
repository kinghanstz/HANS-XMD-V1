let chatbotEnabled = false; // Default is off

hans({ nomCom: "chatbot", reaction: "🤖", categorie: "IA" }, async (dest, zk, commandeOptions) => {
    const { repondre, arg, ms } = commandeOptions;

    if (!arg || arg.length === 0) {
        return repondre(`Use: chatbot on | chatbot off`);
    }

    const action = arg[0].toLowerCase();
    if (action === "on") {
        chatbotEnabled = true;
        repondre("Chatbot has been enabled ✅");
    } else if (action === "off") {
        chatbotEnabled = false;
        repondre("Chatbot has been disabled ❌");
    } else {
        repondre("Invalid option. Use: chatbot on | chatbot off");
    }
});

// Detect and reply to questions when chatbot is enabled
hans({ nomCom: "chatbot", categorie: "IA" }, async (dest, zk, commandeOptions) => {
    const { repondre, arg, ms } = commandeOptions;

    if (!chatbotEnabled || !arg || arg.length === 0) {
        return; // Do nothing if chatbot is disabled or message is empty
    }

    const message = arg.join(' ');
    if (!message.includes('?')) {
        return; // Only reply to messages that contain a question mark
    }

    try {
        const response = await axios.get(`https://api.davidcyriltech.my.id/ai/chatbot?query=${encodeURIComponent(message)}`);
        if (response.data) {
            repondre(response.data.result);
        } else {
            repondre("Error during response generation.");
        }
    } catch (error) {
        console.error('Erreur:', error.message || 'An error occurred');
        repondre("Oops, an error occurred while processing your request.");
    }
});
