const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// --- НАЛАШТУВАННЯ ---
const TOKEN = "8190301055:AAG4hDJRWDMydDVXLMc5EJgr1clJlgBVDdw";
const CHAT_ID = "793126242"; 

// Вебхуки SEQUEmatic (Заміни ТВОЯ_ПОДІЯ на реальні назви, коли створиш їх у SEQUEmatic)
const URLS = {
  // --- Басейн та Тераса ---
  pump_on:      "https://sequematic.com/trigger-custom-webhook/9ECFC1747A/165679/pump_on",
  pump_off:     "https://sequematic.com/trigger-custom-webhook/9ECFC1747A/165681/pump_off",
  terrace_on:   "https://sequematic.com/trigger-custom-webhook/9ECFC1747A/165681/terrace_on", 
  terrace_off:  "https://sequematic.com/trigger-custom-webhook/9ECFC1747A/165681/terrace_off", 

  // --- Сад та Двір ---
  light_on:     "https://sequematic.com/trigger-custom-webhook/9ECFC1747A/165673/svitlo_on",
  light_off:    "https://sequematic.com/trigger-custom-webhook/9ECFC1747A/165676/svitlo_off",
  flood_on:     "https://sequematic.com/trigger-custom-webhook/9ECFC1747A/165697/osvitlennya_sadove_on",
  flood_off:    "https://sequematic.com/trigger-custom-webhook/9ECFC1747A/165699/osvitlennya_sadove_off",
  garden_on:    "https://sequematic.com/trigger-custom-webhook/9ECFC1747A/165701/projector_on",
  garden_off:   "https://https://sequematic.com/trigger-custom-webhook/9ECFC1747A/165703/projector_off",

  // --- Гірлянди (Ілюмінація) ---
  roof_g_on:    "https://sequematic.com/trigger-custom-webhook/9ECFC1747A/165689/navis_avto_on",    
  roof_g_off:   "https://sequematic.com/trigger-custom-webhook/9ECFC1747A/165691/navis_avto_off",   
  balcony_g_on: "https://sequematic.com/trigger-custom-webhook/9ECFC1747A/165685", svitlo_balkon_on,
  balcony_g_off:"https://sequematic.com/trigger-custom-webhook/9ECFC1747A/165687/svitlo_balkon_off,

  // --- Гараж ---
  garage_l_on:  "https://sequematic.com/trigger-custom-webhook/9ECFC1747A/165693/kotel_garage_on",
  garage_l_off: "https://sequematic.com/trigger-custom-webhook/9ECFC1747A/165695/kotel_garage_off", 
  garage_h_on:  "https://sequematic.com/trigger-custom-webhook/9ECFC1747A/165676/garage_h_on",  
  garage_h_off: "https://sequematic.com/trigger-custom-webhook/9ECFC1747A/165676/garage_h_off"  
};

const bot = new TelegramBot(TOKEN, { polling: true });

// Головне меню з кнопками (Згруповано за категоріями)
const mainMenuOptions = {
  reply_markup: {
    keyboard: [
      // Категорія 1: БАСЕЙН ТА ТЕРАСА
      ["🌊 Басейн Насос: УВІМК", "❌ Басейн Насос: ВИМК"],
      ["🚿 Насос тераса: УВІМК", "❌ Насос тераса: ВИМК"],
      
      // Категорія 2: САД ТА ДВІР
      ["💡 Світло двір: УВІМК", "📴 Світло двір: ВИМК"],
      ["☀️ Ліхтарі садові: УВІМК", "🌑 Ліхтарі садові: ВИМК"],
      ["🏡 Садове освітл: УВІМК", "🏡 Садове освітл: ВИМК"],
      ["🛰️ Прожектор: УВІМК", "🛰️ Прожектор: ВИМК"],
      
      // Категорія 3: ІЛЮМІНАЦІЯ
      ["✨ Гірлянда Навіс: УВІМК", "✨ Гірлянда Навіс: ВИМК"],
      ["🏮 Гірлянда Балкон: УВІМК", "🏮 Гірлянда Балкон: ВИМК"],
      
      // Категорія 4: ГАРАЖ
      ["🚗 Старий гараж: УВІМК", "🚗 Старий гараж: ВИМК"],
      ["🔥 Опалення гараж: УВІМК", "❄️ Опалення гараж: ВИМК"],
      
      // СЕРВІСНА
      ["📊 Оновити меню"]
    ],
    resize_keyboard: true
  }
};

console.log("Бот успішно запущений і слухає команди...");

bot.on('message', async (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;

  // Безпека
  if (chatId.toString() !== CHAT_ID.toString()) {
    bot.sendMessage(chatId, "🔒 Доступ обмежено!");
    return;
  }

  if (text === '/start' || text === '📊 Оновити меню') {
    bot.sendMessage(chatId, "🏠 Меню керування розумним домом:", mainMenuOptions);
  } 
  
  // --- ОБРОБКА КНОПОК БАСЕЙНУ ТА ТЕРАСИ ---
  else if (text === "🌊 Басейн Насос: УВІМК") {
    await axios.get(URLS.pump_on).catch(() => {});
    bot.sendMessage(chatId, "✅ Насос басейну працює!");
  } 
  else if (text === "❌ Басейн Насос: ВИМК") {
    await axios.get(URLS.pump_off).catch(() => {});
    bot.sendMessage(chatId, "✅ Насос басейну зупинено!");
  }
  else if (text === "🚿 Насос тераса: УВІМК") {
    await axios.get(URLS.terrace_on).catch(() => {});
    bot.sendMessage(chatId, "✅ Насос на терасі увімкнено!");
  } 
  else if (text === "❌ Насос тераса: ВИМК") {
    await axios.get(URLS.terrace_off).catch(() => {});
    bot.sendMessage(chatId, "✅ Насос на терасі вимкнено!");
  }

  // --- ОБРОБКА КНОПОК САДУ ТА ДВОРУ ---
  else if (text === "💡 Світло двір: УВІМК") {
    await axios.get(URLS.light_on).catch(() => {});
    bot.sendMessage(chatId, "✅ Загальне світло у дворі увімкнено!");
  } 
  else if (text === "📴 Світло двір: ВИМК") {
    await axios.get(URLS.light_off).catch(() => {});
    bot.sendMessage(chatId, "✅ Загальне світло у дворі вимкнено!");
  }
  else if (text === "☀️ Ліхтарі садові: УВІМК") {
    await axios.get(URLS.garden_on).catch(() => {});
    bot.sendMessage(chatId, "✅ Садові ліхтарі увімкнено!");
  } 
  else if (text === "🌑 Ліхтарі садові: ВИМК") {
    await axios.get(URLS.garden_off).catch(() => {});
    bot.sendMessage(chatId, "✅ Садові ліхтарі вимкнено!");
  }
  else if (text === "🏡 Садове освітл: УВІМК") {
    await axios.get(URLS.flood_on).catch(() => {});
    bot.sendMessage(chatId, "✅ Садове освітлення увімкнено!");
  } 
  else if (text === "🏡 Садове освітл: ВИМК") {
    await axios.get(URLS.flood_off).catch(() => {});
    bot.sendMessage(chatId, "✅ Садове освітлення вимкнено!");
  }
  else if (text === "🛰️ Прожектор: УВІМК") {
    await axios.get(URLS.flood_on).catch(() => {});
    bot.sendMessage(chatId, "✅ Потужний прожектор увімкнено!");
  } 
  else if (text === "🛰️ Прожектор: ВИМК") {
    await axios.get(URLS.flood_off).catch(() => {});
    bot.sendMessage(chatId, "✅ Прожектор вимкнено!");
  }

  // --- ОБРОБКА КНОПОК ІЛЮМІНАЦІЇ ---
  else if (text === "✨ Гірлянда Навіс: УВІМК") {
    await axios.get(URLS.roof_g_on).catch(() => {});
    bot.sendMessage(chatId, "✅ Гірлянду під навісом для авто увімкнено!");
  } 
  else if (text === "✨ Гірлянда Навіс: ВИМК") {
    await axios.get(URLS.roof_g_off).catch(() => {});
    bot.sendMessage(chatId, "✅ Гірлянду під навісом вимкнено!");
  }
  else if (text === "🏮 Гірлянда Balkan: УВІМК" || text === "🏮 Гірлянда Балкон: УВІМК") {
    await axios.get(URLS.balcony_g_on).catch(() => {});
    bot.sendMessage(chatId, "✅ Гірлянду на балконі увімкнено!");
  } 
  else if (text === "🏮 Гірлянда Balkan: ВИМК" || text === "🏮 Гірлянда Балкон: ВИМК") {
    await axios.get(URLS.balcony_g_off).catch(() => {});
    bot.sendMessage(chatId, "✅ Гірлянду на балконі вимкнено!");
  }

  // --- ОБРОБКА КНОПОК ГАРАЖУ ---
  else if (text === "🚗 Старий гараж: УВІМК") {
    await axios.get(URLS.garage_l_on).catch(() => {});
    bot.sendMessage(chatId, "✅ Світло в старому гаражі увімкнено!");
  } 
  else if (text === "🚗 Старий гараж: ВИМК") {
    await axios.get(URLS.garage_l_off).catch(() => {});
    bot.sendMessage(chatId, "✅ Світло в старому гаражі вимкнено!");
  }
  else if (text === "🔥 Опалення гараж: УВІМК") {
    await axios.get(URLS.garage_h_on).catch(() => {});
    bot.sendMessage(chatId, "♨️ Опалення гаражу активовано!");
  } 
  else if (text === "❄️ Опалення гараж: ВИМК") {
    await axios.get(URLS.garage_h_off).catch(() => {});
    bot.sendMessage(chatId, "🛑 Опалення гаражу вимкнено!");
  }
});
