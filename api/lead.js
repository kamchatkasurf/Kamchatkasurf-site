/**
 * Vercel Serverless Function: отправка заявки в Telegram
 *
 * Настройка:
 * 1. Создайте бота через @BotFather в Telegram
 * 2. Получите токен бота
 * 3. Узнайте свой chat_id: напишите боту /start, затем откройте
 *    https://api.telegram.org/bot<ВАШ_ТОКЕН>/getUpdates
 * 4. В Vercel: Project Settings → Environment Variables:
 *    TELEGRAM_BOT_TOKEN = токен от BotFather
 *    TELEGRAM_CHAT_ID = ваш chat_id (число)
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error('TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set');
    return res.status(500).json({ ok: false, error: 'Server not configured' });
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ ok: false, error: 'Invalid JSON' });
  }

  const name = body.name || '';
  const phone = body.phone || '';
  const email = body.email || '';

  if (!name.trim() || !phone.trim() || !email.trim()) {
    return res.status(400).json({ ok: false, error: 'Missing required fields' });
  }

  const text = [
    '🆕 Новая заявка с сайта Камчатка Серф',
    '',
    `👤 Имя: ${name.trim()}`,
    `📞 Телефон: ${phone.trim()}`,
    `✉️ Email: ${email.trim()}`
  ].join('\n');

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text
      })
    });

    const data = await response.json();
    if (!data.ok) {
      console.error('Telegram API error:', data);
      return res.status(500).json({ ok: false, error: 'Failed to send' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
}
