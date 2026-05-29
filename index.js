const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// --- НАЛАШТУВАННЯ ---
const TOKEN = "8190301055:AAG4hDJRWDMydDVXLMc5EJgr1clJlgBVDdw";

// Список дозволених чатів (твій особистий ID + ID вашої спільної групи)
const ALLOWED_CHATS = ["793126242", "-5188562127"]; 

// Вебхуки SEQUEmatic
const URLS = {
  // --- Басейн та Тераса ---
  pump_on:      "https://sequematic.com/trigger-custom-webhook/9ECFC1747A/165679/pump_on",
  pump_off:     "https://sequematic.com/trigger-custom-webhook/9ECFC1747A/165681/pump_off",
  terrace_on:   "https://sequematic.com/trigger-custom-webhook/9ECFC1747A/165681/terrace_on", 
  terrace_off:  "https://sequematic.com/trigger-custom-webhook/9ECFC1747A/165681/terrace_off", 

  // --- Сад та Двір ---
  flood_on:     "https://sequematic.com/trigger-custom-webhook/9ECFC1747A/165697/osvitlennya_sadove_on",
  flood_off:    "https://sequematic.com/trigger-custom-webhook/9ECFC1747A/165699/osvitlennya_sadove_off",
  garden_on:    "https://sequematic.com/trigger-custom-webhook/9ECFC1747A/165701/projector_on",
  garden_off:   "https://sequematic.com/trigger-custom-webhook/9ECFC1747A/165703/projector_off",

  // --- Гірлянди (Ілюмінація) ---
  roof_g_on:    "https://sequematic.com/trigger-custom-webhook/9ECFC1747A/165689/navis_avto_on",    
  roof_g_off:   "https://sequematic.com/trigger-custom-webhook/9ECFC1747A/165691/navis_avto_off",   
  balcony_g_on: "https://sequematic.com/trigger-custom-webhook/9ECFC1747A/165685/svitlo_balkon_on", 
  balcony_g_off:"https://sequematic.com/trigger-custom-webhook/9ECFC1747A/165687/svitlo_balkon_off",

  // --- Гараж ---
  garage_l_on:  "https://sequematic.com/trigger-custom-webhook/9ECFC1747A/165693/kotel_garage_on",
  garage_l_off: "https://sequematic.com/trigger-custom-webhook/9ECFC1747A/165695/kotel_garage_off", 
  garage_h_on:  "https://sequematic.com/trigger-custom-webhook/9ECFC1747A/165705/garage_h_on",  
  garage_h_off: "https://sequematic.com/trigger-custom-webhook/9ECFC1747A/165707/garage_h_off"  
};

const bot = new TelegramBot(TOKEN, { polling: true });

// Нове згруповане меню з кнопками (Змінено порядок категорій)
const mainMenuOptions = {
  reply_markup: {
    keyboard: [
      // Категорія 1: ГАРАЖ (ТЕПЕР ЗВЕРХУ)
      ["🚗 Старий гараж: УВІМК", "🚗 Старий гараж: ВИМК"],
      ["🔥 Опалення гараж: УВІМК", "❄️ Опалення гараж: ВИМК"],
      
      // Категорія 2: САД ТА ДВІР
      ["🛰️ Прожектор: УВІМК", "🛰️ Прожектор: ВИМК"],
      ["🏡 Садове освітл: УВІМК", "🏡 Садове освітл: ВИМК"],
      
      // Категорія 3: ІЛЮМІНАЦІЯ
      ["✨ Гірлянда Навіс: УВІМК", "✨ Гірлянда Навіс: ВИМК"],
      ["🏮 Гірлянда Балкон: УВІМК", "🏮 Гірлянда Балкон: ВИМК"],
      
      // Категорія 4: БАСЕЙН ТА ТЕРАСА (ТЕПЕР У САМОМУ НИЗУ)
      ["🌊 Басейн Насос: УВІМК", "❌ Басейн Насос: ВИМК"],
      ["🚿 Насос тераса: УВІМК", "❌ Насос тераса: ВИМК"],
      
      // СЕРВІСНА КНОПКА
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
  if (!ALLOWED_CHATS.includes(chatId.toString())) {
    bot.sendMessage(chatId, "🔒 Доступ обмежено! Цей бот керує приватним розумним домом.");
    return;
  }

  // Реакція на команду /start або оновлення меню
  if (text === '/start' || text === '📊 Оновити меню' || text === '/start@' + (await bot.getMe()).username) {
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
  else if (text === "🏡 Садове освітл: УВІМК") {
    await axios.get(URLS.flood_on).catch(() => {});
    bot.sendMessage(chatId, "✅ Садове освітлення увімкнено!");
  } 
  else if (text === "🏡 Садове освітл: ВИМК") {
    await axios.get(URLS.flood_off).catch(() => {});
    bot.sendMessage(chatId, "✅ Садове освітлення вимкнено!");
  }
  else if (text === "🛰️ Прожектор: УВІМК") {
    await axios.get(URLS.garden_on).catch(() => {});
    bot.sendMessage(chatId, "✅ Потужний прожектор увімкнено!");
  } 
  else if (text === "🛰️ Прожектор: ВИМК") {
    await axios.get(URLS.garden_off).catch(() => {});
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
