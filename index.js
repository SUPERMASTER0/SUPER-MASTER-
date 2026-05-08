const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

console.log("🚀 Bot Started");

// ================= ENV =================
const token = process.env.BOT_TOKEN;
if (!token) {
  console.error("❌ BOT_TOKEN missing in ENV");
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

// ================= CHANNELS =================
const CHANNELS = [
  "@URVIGAMER",
  "@Supermastertrick",
  "@Raja_Game_bunny"
];

// ================= SMM PANEL CONFIG =================
const ACTIVE_PANEL = {
  name: "TELEKARTSMM",
  url: "https://telekartsmm.com/api/v2",
  key: process.env.API_KEY,
  service: "1023"
};

// ================= SEND ORDER FUNCTION =================
async function sendOrder(link, quantity) {
  try {
    console.log("📦 Sending Order...");
    console.log("🔗 Link:", link);
    console.log("📊 Quantity:", quantity);

    const res = await axios.post(ACTIVE_PANEL.url, {
      key: ACTIVE_PANEL.key,
      action: "add",
      service: ACTIVE_PANEL.service,
      link: link,
      quantity: quantity
    });

    console.log("📡 API Response:", res.data);

    if (res.data && res.data.order) {
      console.log("✅ Order Success ID:", res.data.order);
      return true;
    } else {
      console.log("❌ Order Failed");
      return false;
    }

  } catch (err) {
    console.log("❌ API Error:", err.message);
    return false;
  }
}

// ================= DUPLICATE PROTECTION =================
let processed = new Set();

// ================= CHANNEL LISTENER =================
bot.on("channel_post", async (msg) => {
  try {
    if (!msg.chat || !msg.message_id) return;

    const username = msg.chat.username ? "@" + msg.chat.username : null;

    // Ignore unknown channels
    if (!CHANNELS.includes(username)) return;

    // ✅ FIXED TEMPLATE STRING
    const uniqueKey = ${username}_${msg.message_id};

    if (processed.has(uniqueKey)) return;
    processed.add(uniqueKey);

    // ✅ FIXED LINK FORMAT
    const cleanUsername = username.replace("@", "");
    const link = https://t.me/${cleanUsername}/${msg.message_id};

    console.log("📢 New Post Detected:", link);

    // ================= TEST MODE =================
    const burst = [1620]; // you can change

    for (let qty of burst) {
      await sendOrder(link, qty);

      // delay to avoid spam detection
      await new Promise((resolve) => setTimeout(resolve, 30000));
    }

  } catch (err) {
    console.log("❌ Listener Error:", err.message);
  }
});

// ================= ERROR HANDLING =================
bot.on("polling_error", (error) => {
  console.log("❌ Polling Error:", error.message);
});

process.on("unhandledRejection", (err) => {
  console.log("❌ Unhandled Rejection:", err.message);
});
