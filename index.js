const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// --- НАЛАШТУВАННЯ ---
const TOKEN = "8190301055:AAG4hDJRWDMydDVXLMc5EJgr1clJlgBVDdw";
const CHAT_ID = "793126242"; 

// Вебхуки SEQUEmatic
const URLS = {
  light_on:  "https://sequematic.com/trigger-custom-webhook/9ECFC1747A/165673/svitlo_on",
  light_off: "https://sequematic.com/trigger-custom-webhook/9ECFC1747A/165676/svitlo_off",
  pump_on:   "https://sequematic.com/trigger-custom-webhook/9ECFC1747A/165679/pump_on",
  pump_off:  "https://sequematic.com/trigger-custom-webhook/9ECFC1747A/165681/pump_off"
};

const bot = new TelegramBot(TOKEN, { polling: true });

// Головне меню з кнопками
const mainMenuOptions = {
  reply_markup: {
    keyboard: [
      ["💡 Світло: УВІМК", "📴 Світло: ВИМК"],
      ["🚿 Насос: УВІМК", "❌ Насос: ВИМК"],
      ["📊 Оновити меню"]
    ],
    resize_keyboard: true
  }
};

console.log("Бот успішно запущений і слухає команди...");

bot.on('message', async (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;

  if (chatId.toString() !== CHAT_ID.toString()) {
    bot.sendMessage(chatId, "🔒 Доступ обмежено!");
    return;
  }

  if (text === '/start' || text === '📊 Оновити меню') {
    bot.sendMessage(chatId, "🏠 Керування розумним домом:", mainMenuOptions);
  } 
  else if (text === "💡 Світло: УВІМК") {
    await axios.get(URLS.light_on).catch(() => {});
    bot.sendMessage(chatId, "✅ Світло увімкнено!");
  } 
  else if (text === "📴 Світло: ВИМК") {
    await axios.get(URLS.light_off).catch(() => {});
    bot.sendMessage(chatId, "✅ Світло вимкнено!");
  }
  else if (text === "🚿 Насос: УВІМК") {
    await axios.get(URLS.pump_on).catch(() => {});
    bot.sendMessage(chatId, "✅ Насос працює!");
  }
  else if (text === "❌ Насос: ВИМК") {
    await axios.get(URLS.pump_off).catch(() => {});
    bot.sendMessage(chatId, "✅ Насос зупинено!");
  }
});
