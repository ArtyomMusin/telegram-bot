const TelegramBot = require('node-telegram-bot-api');

const token = '6571139248:AAEBIwcYmKuYvhYVfowzsSL3WmYu6QWB6rU'

const bot = new TelegramBot(token, {polling: true});

const commands = [
    {command: '/start', description: 'Старт программы'},
    {command: '/name', description: 'Узнать имя разработчика'},
    {command: '/info', description: 'Узнать доступные команды'},
    {command: '/game', description: 'Сыграть в мини-игру'},
]

bot.setMyCommands(commands)

const chats = {}
const gameOptions = {

}

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    switch (msg.text) {
        case '/start':
            bot.sendMessage(chatId, 'Привет, мой новый друг')
            break
        case '/name':
            bot.sendMessage(chatId, 'Имя разработчика - Артем')
            break
        case '/game':
            await bot.sendMessage(chatId, 'Сейчас я загадаю число от 0 до 9, а Вы отгадайте')
            const randomNumber = Math.random() * 10
            chats[chatId] = randomNumber
            await bot.sendMessage(chatId, 'Отгадывайте')
            break
        case '/info':
            bot.sendMessage(chatId, commands.map(command => `${command.command} - ${command.description}`).join(" \n"))
            break
        default:
            bot.sendMessage(chatId, 'Для просмотра доступных команд напишите "/info"')
    }
})
