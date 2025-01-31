"use strict";

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) {
    k2 = k;
  }
  var desc = Object.getOwnPropertyDescriptor(m, k);
  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
    desc = {
      enumerable: true,
      get: function () {
        return m[k];
      }
    };
  }
  Object.defineProperty(o, k2, desc);
} : function (o, m, k, k2) {
  if (k2 === undefined) {
    k2 = k;
  }
  o[k2] = m[k];
});
var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});
var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) {
    return mod;
  }
  var result = {};
  if (mod != null) {
    for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) {
      __createBinding(result, mod, k);
    }
  }
  __setModuleDefault(result, mod);
  return result;
};
var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};
Object.defineProperty(exports, "__esModule", {
  value: true
});
const baileys_1 = __importStar(require("@whiskeysockets/baileys"));
const logger_1 = __importDefault(require("@whiskeysockets/baileys/lib/Utils/logger"));
const logger = logger_1.default.child({});
logger.level = 'silent';
const pino = require("pino");
const axios = require('axios');
const { DateTime } = require('luxon');
const boom_1 = require("@hapi/boom");
const conf = require("./set");
let fs = require("fs-extra");
let path = require("path");
const FileType = require('file-type');
const {
  Sticker,
  createSticker,
  StickerTypes
} = require('wa-sticker-formatter');
//import chalk from 'chalk'
const {
  verifierEtatJid,
  recupererActionJid
} = require("./bdd/antilien");
const {
  atbverifierEtatJid,
  atbrecupererActionJid
} = require("./bdd/antibot");
let evt = require(__dirname + "/keizzah/keith");
const {
  isUserBanned,
  addUserToBanList,
  removeUserFromBanList
} = require("./bdd/banUser");
const {
  addGroupToBanList,
  isGroupBanned,
  removeGroupFromBanList
} = require("./bdd/banGroup");
const {
  isGroupOnlyAdmin,
  addGroupToOnlyAdminList,
  removeGroupFromOnlyAdminList
} = require("./bdd/onlyAdmin");
//const //{loadCmd}=require("/Hanstz/mesfonctions")
let {
  reagir
} = require(__dirname + "/keizzah/app");
var session = conf.session.replace(/HANS-MD;;;=>/g, "");
const prefixe = conf.PREFIXE || [];

require('dotenv').config({
  'path': "./config.env"
});
async function authentification() {
  try {
    //console.log("le data "+data)
    if (!fs.existsSync(__dirname + "/auth/creds.json")) {
      console.log("connected successfully...");
      await fs.writeFileSync(__dirname + "/auth/creds.json", atob(session), "utf8");
      //console.log(session)
    } else if (fs.existsSync(__dirname + "/auth/creds.json") && session != "zokk") {
      await fs.writeFileSync(__dirname + "/auth/creds.json", atob(session), "utf8");
    }
  } catch (e) {
    console.log("Session Invalid " + e);
    return;
  }
}
authentification();
0;
const store = baileys_1.makeInMemoryStore({
  logger: pino().child({
    level: "silent",
    stream: "store"
  })
});
setTimeout(() => {
  async function main() {
    0;
    const {
      version,
      isLatest
    } = await baileys_1.fetchLatestBaileysVersion();
    0;
    const {
      state,
      saveCreds
    } = await baileys_1.useMultiFileAuthState(__dirname + "/auth");
    0;
    const sockOptions = {
      version,
      logger: pino({
        level: "silent"
      }),
      browser: ['HANS-MD', "safari", "1.0.0"],
      printQRInTerminal: true,
      fireInitQueries: false,
      shouldSyncHistoryMessage: true,
      downloadHistory: true,
      syncFullHistory: true,
      generateHighQualityLinkPreview: true,
      markOnlineOnConnect: false,
      keepAliveIntervalMs: 30_000,
      /* auth: state*/auth: {
        creds: state.creds,
        /** caching makes the store faster to send/recv messages */
        keys: baileys_1.makeCacheableSignalKeyStore(state.keys, logger)
      },
      //////////
      getMessage: async key => {
        if (store) {
          const msg = await store.loadMessage(key.remoteJid, key.id, undefined);
          return msg.message || undefined;
        }
        return {
          conversation: 'An Error Occurred, Repeat Command!'
        };
      }
      ///////
    };

    0;
    const zk = baileys_1.default(sockOptions);
    store.bind(zk.ev);
    setInterval(() => {
      store.writeToFile("store.json");
    }, 3000);
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Track the last text time to prevent overflow
let lastTextTime = 0;
const messageDelay = 5000; // Set the minimum delay between messages (in milliseconds)

zk.ev.on('call', async (callData) => {
  if (conf.ANTICALL === 'yes') {
    const callId = callData[0].id;
    const callerId = callData[0].from;
    
    // Reject the call
    await zk.rejectCall(callId, callerId);

    // Check if enough time has passed since the last message
    const currentTime = Date.now();
    if (currentTime - lastTextTime >= messageDelay) {
      // Send the rejection message if the delay has passed
      await client.sendMessage(callerId, {
        text: conf.ANTICALL_MSG
      });

      // Update the last text time
      lastTextTime = currentTime;
    } else {
      console.log('Message skipped to prevent overflow');
    }
  }
});

if (conf.AUTOBIO === 'yes') {
    setInterval(() => {
      const date = new Date();
      zk.updateProfileStatus(
        `${conf.OWNER_NAME} is active 24/7 ${date.toLocaleString('en-US', { timeZone: 'Africa/Dodoma' })} It's a ${date.toLocaleString('en-US', { weekday: 'long', timeZone: 'Africa/Dodoma' })}.`
      );
    }, 10 * 1000);
  }
 let repliedContacts = new Set();

zk.ev.on("messages.upsert", async (m) => {
  const { messages } = m;
  const ms = messages[0];
  if (!ms.message) {
    return;
  }

  const messageText = ms.message.conversation || ms.message.extendedTextMessage?.text || "";
  const remoteJid = ms.key.remoteJid;
  const senderNumber = remoteJid.split('@')[0];

  // Default auto-reply message
  let auto_reply_message = `Hello @${senderNumber}, my owner is unavailable right now. Kindly leave a message.`;

  // Check if the message exists and is a command to set a new auto-reply message
  if (messageText.startsWith('>') && ms.key.fromMe) {
    const command = messageText.slice(1).split(" ")[0]; // Command after prefix
    const newMessage = messageText.slice(command.length + 2).trim(); // New message content

    // Update the auto-reply message if the command is 'setautoreply'
    if (command === "setautoreply" && newMessage) {
      auto_reply_message = newMessage;
      await zk.sendMessage(remoteJid, {
        text: `Auto-reply message has been updated to:\n"${auto_reply_message}"`
      });
      return;
    }
  }

  // Check if auto-reply is enabled, contact hasn't received a reply, and it's a private chat
  if (conf.GREET === "yes" && !repliedContacts.has(remoteJid) && !ms.key.fromMe && !remoteJid.includes("@g.us")) {
    await zk.sendMessage(remoteJid, {
      text: auto_reply_message,
      mentions: [remoteJid]
    });

    // Add contact to replied set to prevent repeat replies
    repliedContacts.add(remoteJid);
  }
});
    // Function to format notification message
function createNotification(deletedMessage) {
  const deletedBy = deletedMessage.key.participant || deletedMessage.key.remoteJid;
  let notification = `*🎃HANS ANTIDELETE🎃*\n\n`;
  notification += `*Time deleted⌚:* ${new Date().toLocaleString()}\n`;
  notification += `*Deleted by🤦‍♂️:* @${deletedBy.split('@')[0]}\n\n*Powered by Hanstz*\n\n`;
  return notification;
}

// Helper function to download media
async function downloadMedia(message) {
  try {
    if (message.imageMessage) {
      return await zk.downloadMediaMessage(message.imageMessage);
    } else if (message.videoMessage) {
      return await zk.downloadMediaMessage(message.videoMessage);
    } else if (message.documentMessage) {
      return await zk.downloadMediaMessage(message.documentMessage);
    } else if (message.audioMessage) {
      return await zk.downloadMediaMessage(message.audioMessage);
    } else if (message.stickerMessage) {
      return await zk.downloadMediaMessage(message.stickerMessage);
    } else if (message.voiceMessage) {
      return await zk.downloadMediaMessage(message.voiceMessage);
    } else if (message.gifMessage) {
      return await zk.downloadMediaMessage(message.gifMessage);
    }
  } catch (error) {
    console.error("Error downloading media:", error);
  }
  return null;
}

// Event listener for all incoming messages
zk.ev.on("messages.upsert", async m => {
  // Check if ANTIDELETE is enabled
  if (conf.ADM === "yes") {
    const { messages } = m;
    const ms = messages[0];

    // If the message has no content, ignore
    if (!ms.message) {
      return;
    }

    // Get the message key and remote JID (group or individual)
    const messageKey = ms.key;
    const remoteJid = messageKey.remoteJid;

    // Store message for future undelete reference
    if (!store.chats[remoteJid]) {
      store.chats[remoteJid] = [];
    }

    // Save the received message to storage
    store.chats[remoteJid].push(ms);

    // Handle deleted messages (when protocolMessage is present and type is 0)
    if (ms.message.protocolMessage && ms.message.protocolMessage.type === 0) {
      const deletedKey = ms.message.protocolMessage.key;

      // Search for the deleted message in the stored messages
      const chatMessages = store.chats[remoteJid];
      const deletedMessage = chatMessages.find(msg => msg.key.id === deletedKey.id);

      if (deletedMessage) {
        try {
          // Create notification about the deleted message
          const notification = createNotification(deletedMessage);

          // Check the type of the deleted message (text or media)
          if (deletedMessage.message.conversation) {
            // Text message
            await zk.relayMessage(remoteJid, deletedMessage, {
              caption: notification,
              mentions: [deletedMessage.key.participant]
            });
          } else if (
            deletedMessage.message.imageMessage ||
            deletedMessage.message.videoMessage ||
            deletedMessage.message.documentMessage ||
            deletedMessage.message.audioMessage ||
            deletedMessage.message.stickerMessage ||
            deletedMessage.message.voiceMessage ||
            deletedMessage.message.gifMessage
          ) {
            // Media message (image, video, document, audio, sticker, voice, gif)
            const mediaBuffer = await downloadMedia(deletedMessage.message);
            if (mediaBuffer) {
              let mediaType = 'audio'; // Default to 'audio' if no other match

              // Determine the media type
              if (deletedMessage.message.imageMessage) mediaType = 'image';
              if (deletedMessage.message.videoMessage) mediaType = 'video';
              if (deletedMessage.message.documentMessage) mediaType = 'document';
              if (deletedMessage.message.stickerMessage) mediaType = 'sticker';
              if (deletedMessage.message.voiceMessage) mediaType = 'audio'; // Voice messages are treated as audio
              if (deletedMessage.message.gifMessage) mediaType = 'video'; // GIFs are treated as video

              // Relay the media with notification and participant mention
              await zk.relayMessage(remoteJid, deletedMessage, {
                [mediaType]: mediaBuffer,
                caption: notification,
                mentions: [deletedMessage.key.participant]
              });
            }
          }
        } catch (error) {
          console.error('Error handling deleted message:', error);
        }
      }
    }
  }
});

      // Function to format notification message
function createNotification(deletedMessage) {
  const deletedBy = deletedMessage.key.participant || deletedMessage.key.remoteJid;
  let notification = `*🎃HANS ANTIDELETE🎃*\n\n`;
  notification += `*Time deleted⌚:* ${new Date().toLocaleString()}\n`;
  notification += `*Deleted by🤦‍♂️:* @${deletedBy.split('@')[0]}\n\n*Powered by Hanstz*\n\n`;
  return notification;
}

// Helper function to download media
async function downloadMedia(message) {
  try {
    if (message.imageMessage) {
      return await zk.downloadMediaMessage(message.imageMessage);
    } else if (message.videoMessage) {
      return await zk.downloadMediaMessage(message.videoMessage);
    } else if (message.documentMessage) {
      return await zk.downloadMediaMessage(message.documentMessage);
    } else if (message.audioMessage) {
      return await zk.downloadMediaMessage(message.audioMessage);
    } else if (message.stickerMessage) {
      return await zk.downloadMediaMessage(message.stickerMessage);
    } else if (message.voiceMessage) {
      return await zk.downloadMediaMessage(message.voiceMessage);
    } else if (message.gifMessage) {
      return await zk.downloadMediaMessage(message.gifMessage);
    }
  } catch (error) {
    console.error("Error downloading media:", error);
  }
  return null;
}

// Event listener for all incoming messages
zk.ev.on("messages.upsert", async m => {
  // Check if ANTIDELETE is enabled
  if (conf.ADM === "yes") {
    const { messages } = m;
    const ms = messages[0];

    // If the message has no content, ignore
    if (!ms.message) {
      return;
    }

    // Get the message key and remote JID (group or individual)
    const messageKey = ms.key;
    const remoteJid = messageKey.remoteJid;

    // Store message for future undelete reference
    if (!store.chats[remoteJid]) {
      store.chats[remoteJid] = [];
    }

    // Save the received message to storage
    store.chats[remoteJid].push(ms);

    // Handle deleted messages (when protocolMessage is present and type is 0)
    if (ms.message.protocolMessage && ms.message.protocolMessage.type === 0) {
      const deletedKey = ms.message.protocolMessage.key;

      // Search for the deleted message in the stored messages
      const chatMessages = store.chats[remoteJid];
      const deletedMessage = chatMessages.find(msg => msg.key.id === deletedKey.id);
      if (deletedMessage) {
        try {
          // Create notification about the deleted message
          const notification = createNotification(deletedMessage);

          // Check the type of the deleted message (text or media)
          if (deletedMessage.message.conversation) {
            // Text message
            await zk.sendMessage(remoteJid, {
              text: notification + `*Message:* ${deletedMessage.message.conversation}`,
              mentions: [deletedMessage.key.participant]
            });
          } else if (
            deletedMessage.message.imageMessage ||
            deletedMessage.message.videoMessage ||
            deletedMessage.message.documentMessage ||
            deletedMessage.message.audioMessage ||
            deletedMessage.message.stickerMessage ||
            deletedMessage.message.voiceMessage ||
            deletedMessage.message.gifMessage
          ) {
            // Media message (image, video, document, audio, sticker, voice, gif)
            const mediaBuffer = await downloadMedia(deletedMessage.message);
            if (mediaBuffer) {
              let mediaType = 'audio'; // Default to 'audio' if no other match

              if (deletedMessage.message.imageMessage) mediaType = 'image';
              if (deletedMessage.message.videoMessage) mediaType = 'video';
              if (deletedMessage.message.documentMessage) mediaType = 'document';
              if (deletedMessage.message.stickerMessage) mediaType = 'sticker';
              if (deletedMessage.message.voiceMessage) mediaType = 'audio'; // Voice messages can be treated as audio
              if (deletedMessage.message.gifMessage) mediaType = 'video'; // GIFs are generally video type

              // Send the media with notification and participant mention
              await zk.sendMessage(remoteJid, {
                [mediaType]: mediaBuffer,
                caption: notification,
                mentions: [deletedMessage.key.participant]
              });
            }
          }
        } catch (error) {
          console.error('Error handling deleted message:', error);
        }
      }
    }
  }
});
    



// AUTO_REACT: React to messages with random emoji if enabled.
if (conf.AUTO_REACT === "yes") {
  zk.ev.on("messages.upsert", async m => {
    const { messages } = m;

    // Load emojis from the JSON file
    const emojiFilePath = path.resolve(__dirname, 'database', 'emojis.json');
    let emojis = [];
    
    try {
      // Read the emojis from the file
      const data = fs.readFileSync(emojiFilePath, 'utf8');
      emojis = JSON.parse(data); // Parse the JSON data into an array
    } catch (error) {
      console.error('Error reading emojis file:', error);
      return;
    }

    // Process each message
    for (const message of messages) {
      if (!message.key.fromMe) {
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        
        // React to the message with a random emoji
        await zk.sendMessage(message.key.remoteJid, {
          react: {
            text: randomEmoji,
            key: message.key
          }
        });
      }
    }
  });
}
    

// Track the last reaction time to prevent overflow
let lastReactionTime = 0;

// Array of love emojis to react with
const loveEmojis = ["❤️", "💖", "💘", "💝", "💓", "💌", "💕", "😎", "🔥", "💥", "💯", "✨", "🌟", "🌈", "⚡", "💎", "🌀", "👑", "🎉", "🎊", "🦄", "👽", "🛸", 
  "🚀", "🦋", "💫", "🍀", "🎶", "🎧", "🎸", "🎤", "🏆", "🏅", "🌍", "🌎", "🌏", "🎮", "🎲", "💪", 
  "🏋️", "🥇", "👟", "🏃", "🚴", "🚶", "🏄", "⛷️", "🕶️", "🧳", "🍿", "🍿", "🥂", "🍻", "🍷", "🍸", 
  "🥃", "🍾", "🎯", "⏳", "🎁", "🎈", "🎨", "🌻", "🌸", "🌺", "🌹", "🌼", "🌞", "🌝", "🌜", "🌙", 
  "🌚", "🍀", "🌱", "🍃", "🍂", "🌾", "🐉", "🐍", "🦓", "🦄", "🦋", "🦧", "🦘", "🦨", "🦡", "🐉", 
  "🐅", "🐆", "🐓", "🐢", "🐊", "🐠", "🐟", "🐡", "🦑", "🐙", "🦀", "🐬", "🦕", "🦖", "🐾", "🐕", 
  "🐈", "🐇", "🐾"];

if (conf.AUTO_LIKE_STATUS === "yes") {
    console.log("AUTO_LIKE_STATUS is enabled. Listening for status updates...");

    zk.ev.on("messages.upsert", async (m) => {
        const { messages } = m;

        for (const message of messages) {
            // Check if the message is a status update
            if (message.key && message.key.remoteJid === "status@broadcast") {
                console.log("Detected status update from:", message.key.remoteJid);

                // Ensure throttling by checking the last reaction time
                const now = Date.now();
                if (now - lastReactionTime < 5000) {  // 5-second interval
                    console.log("Throttling reactions to prevent overflow.");
                    continue;
                }

                // Check if bot user ID is available
                const hans = zk.user && zk.user.id ? zk.user.id.split(":")[0] + "@s.whatsapp.net" : null;
                if (!hans) {
                    console.log("Bot's user ID not available. Skipping reaction.");
                    continue;
                }

                // Select a random love emoji
                const randomLoveEmoji = loveEmojis[Math.floor(Math.random() * loveEmojis.length)];

                // React to the status with the selected love emoji
                await zk.sendMessage(message.key.remoteJid, {
                    react: {
                        key: message.key,
                        text: randomLoveEmoji, // Reaction emo