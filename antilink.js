const linkRegex = /(https?:\/\/[^\s]+)/; // Regex to detect links
const ANTILINK = process.env.ANTILINK || "no"; // Read from environment variable, default to "no"

async function handleAntilink(message, bot) {
    if (ANTILINK.toLowerCase() !== "yes") return; // Check if antilink is enabled

    let chat = await message.getChat();
    if (!chat.isGroup) return; // Only run in groups

    if (linkRegex.test(message.body)) {
        try {
            let groupAdmins = await chat.getAdmins();
            let botNumber = bot.info.wid._serialized;

            if (groupAdmins.some(admin => admin.id._serialized === botNumber)) {
                await message.delete(true); // Delete the message
                await bot.sendMessage(chat.id, `⚠️ *No links allowed!* @${message.author.split("@")[0]}, please follow the rules!`, { mentions: [message.author] });
            }
        } catch (error) {
            console.error("Error handling antilink:", error);
        }
    }
}

module.exports = { handleAntilink };
