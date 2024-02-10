const TelegramBot = require('node-telegram-bot-api')
const Game = require('./game')

const token = '6571139248:AAEBIwcYmKuYvhYVfowzsSL3WmYu6QWB6rU'

const bot = new TelegramBot(token, {polling: true});

const commands = [
    {command: '/info', description: 'Find out the available commands'},
    {command: '/game', description: 'Play a mini-game'},
]

bot.setMyCommands(commands)

let game = null

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    switch (msg.text) {
        case '/start':
            await bot.sendMessage(chatId, 'Hello, my new friend')
            bot.sendMessage(chatId, commands.map(command => `${command.command} - ${command.description}`).join(" \n"))
            break
        case '/game':
            game = new Game(bot, chatId)
            game.startGame()
            break
        case '/info':
            bot.sendMessage(chatId, commands.map(command => `${command.command} - ${command.description}`).join(" \n"))
            break
        default:
            bot.sendMessage(chatId, 'To view the available commands, write "/info"')
    }
})

bot.on('callback_query',async msg => {
    const { data } = msg

    if (game) {
        const result = await game.checkResult(data)
        if (!result) {
            game = null
        }
    }
})
