const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// --- НАЛАШТУВАННЯ ---
const TOKEN = "8190301055:AAG4hDJRWDMydDVXLMc5EJgr1clJlgBVDdw";
const ALLOWED_CHATS = ["793126242", "-5188562127"]; 

// Вебхуки SEQUEmatic
const URLS = {
  pump:       { on: "https://sequematic.com/trigger-custom-webhook/9ECFC1747A/165679/pump_on", off: "https://sequematic.com/trigger-custom-webhook/9ECFC1747A/165681/pump_off" },
  terrace:    { on: "https://sequematic.com/trigger-custom-webhook/9ECFC1747A/165681/terrace_on", off: "https://sequematic.com/trigger-custom-webhook/9ECFC1747A/165681/terrace_off" },
  flood:      { on: "https://sequematic.com/trigger-custom-webhook/9ECFC1747A/165697/osvitlennya_sadove_on", off: "https://sequematic.com/trigger-custom-webhook/9ECFC1747A/165699/osvitlennya_sadove_off" },
  garden:     { on: "https://sequematic.com/trigger-custom-webhook/9ECFC1747A/165701/projector_on", off: "https://sequematic.com/trigger-custom-webhook/9ECFC1747A/165703/projector_off" },
  roof_g:     { on: "https://sequematic.com/trigger-custom-webhook/9ECFC1747A/165689/navis_avto_on", off: "https://sequematic.com/trigger-custom-webhook/9ECFC1747A/165691/navis_avto_off" },
  balcony_g:  { on: "https://sequematic.com/trigger-custom-webhook/9ECFC1747A/165685/svitlo_balkon_on", off: "https://sequematic.com/trigger-custom-webhook/9ECFC1747A/165687/svitlo_balkon_off" },
  garage_l:   { on: "https://sequematic.com/trigger-custom-webhook/9ECFC1747A/165693/kotel_garage_on", off: "https://sequematic.com/trigger-custom-webhook/9ECFC1747A/165695/kotel_garage_off" },
  garage_h:   { on: "https://sequematic.com/trigger-custom-webhook/9ECFC1747A/165705/garage_h_on", off: "https://sequematic.com/trigger-custom-webhook/9ECFC1747A/165707/garage_h_off" }
};

// Поточні статуси приладів у пам'яті бота (false = вимкнено 🔴, true = увімкнено 🟢)
let deviceStatuses = {
  garage_l: false,
  garage_h: false,
  garden: false,
  flood: false,
  roof_g: false,
  balcony_g: false,
  pump: false,
  terrace: false
};

const bot = new TelegramBot(TOKEN, { polling: true });

// Функція генерації інлайн-клавіатури на основі поточних статусів
function generateKeyboard() {
  const getStatusEmoji = (status) => status ? "🟢" : "🔴";

  return {
    reply_markup: {
      inline_keyboard: [
        // КАТЕГОРІЯ: ГАРАЖ
        [
          { text: `${getStatusEmoji(deviceStatuses.garage_l)} Старий гараж`, callback_data: 'toggle_garage_l' },
          { text: `${getStatusEmoji(deviceStatuses.garage_h)} Опалення гараж`, callback_data: 'toggle_garage_h' }
        ],
        // КАТЕГОРІЯ: САД ТА ДВІР
        [
          { text: `${getStatusEmoji(deviceStatuses.garden)} Прожектор`, callback_data: 'toggle_garden' },
          { text: `${getStatusEmoji(deviceStatuses.flood)} Садове освітл`, callback_data: 'toggle_flood' }
        ],
        // КАТЕГОРІЯ: ІЛЮМІНАЦІЯ
        [
          { text: `${getStatusEmoji(deviceStatuses.roof_g)} Гірлянда Навіс`, callback_data: 'toggle_roof_g' },
          { text: `${getStatusEmoji(deviceStatuses.balcony_g)} Гірлянда Балкон`, callback_data: 'toggle_balcony_g' }
        ],
        // КАТЕГОРІЯ: НАСОСИ
        [
          { text: `${getStatusEmoji(deviceStatuses.pump)} Басейн Насос`, callback_data: 'toggle_pump' },
          { text: `${getStatusEmoji(deviceStatuses.terrace)} Насос тераса`, callback_data: 'toggle_terrace' }
        ],
        // СЕРВІСНА КНОПКА (Оновити інтерфейс)
        [
          { text: "🔄 Оновити пульт", callback_data: 'refresh_panel' }
        ]
      ]
    }
  };
}

console.log("Бот успішно запущений на інлайн-кнопках...");

// Обробка текстових команд (/start)
bot.on('message', async (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;

  if (!ALLOWED_CHATS.includes(chatId.toString())) {
    bot.sendMessage(chatId, "🔒 Доступ обмежено! Цей бот керує приватним розумним домом.");
    return;
  }

  if (text && text.startsWith('/start')) {
    bot.sendMessage(chatId, "🏠 **Пульт керування розумним домом:**\n🟢 — Увімкнено | 🔴 — Вимкнено", {
      parse_mode: "Markdown",
      ...generateKeyboard()
    });
  }
});

// Обробка натискання інлайн-кнопок (Callback Queries)
bot.on('callback_query', async (callbackQuery) => {
  const action = callbackQuery.data;
  const msg = callbackQuery.message;
  const chatId = msg.chat.id;
  const messageId = msg.message_id;

  if (!ALLOWED_CHATS.includes(chatId.toString())) {
    bot.answerCallbackQuery(callbackQuery.id, { text: "🔒 Доступ обмежено!", show_alert: true });
    return;
  }

  // Обробка кнопки оновлення
  if (action === 'refresh_panel') {
    bot.editMessageReplyMarkup(generateKeyboard().reply_markup, { chat_id: chatId, message_id: messageId })
      .catch(() => {});
    bot.answerCallbackQuery(callbackQuery.id, { text: "Пульт оновлено" });
    return;
  }

  // Визначаємо який прилад натиснули
  const deviceMap = {
    toggle_garage_l: { key: 'garage_l', name: 'Старий гараж' },
    toggle_garage_h: { key: 'garage_h', name: 'Опалення гараж' },
    toggle_garden:   { key: 'garden',   name: 'Прожектор' },
    toggle_flood:    { key: 'flood',    name: 'Садове освітл' },
    toggle_roof_g:   { key: 'roof_g',   name: 'Гірлянда Навіс' },
    toggle_balcony_g:{ key: 'balcony_g',name: 'Гірлянда Балкон' },
    toggle_pump:     { key: 'pump',     name: 'Басейн Насос' },
    toggle_terrace:  { key: 'terrace',  name: 'Насос тераса' }
  };

  const device = deviceMap[action];

  if (device) {
    // Перемикаємо статус (з true на false, або з false на true)
    deviceStatuses[device.key] = !deviceStatuses[device.key];
    const currentState = deviceStatuses[device.key];

    // Повідомляємо Telegram, що ми прийняли клік (прибирає "годинничок" з кнопки)
    bot.answerCallbackQuery(callbackQuery.id, { 
      text: `${device.name}: ${currentState ? 'УВІМК 🟢' : 'ВИМК 🔴'}` 
    });

    // Оновлюємо кнопки на екрані (змінюємо емодзі статусу)
    bot.editMessageReplyMarkup(generateKeyboard().reply_markup, { chat_id: chatId, message_id: messageId })
      .catch(() => {});

    // Надсилаємо відповідний вебхук на SEQUEmatic
    const webhookUrl = currentState ? URLS[device.key].on : URLS[device.key].off;
    await axios.get(webhookUrl).catch(() => {});
  }
});
