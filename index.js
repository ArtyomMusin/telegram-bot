const TelegramBot = require('node-telegram-bot-api')
const Game = require('./game')
const sequelize = require('./db')
const UserModel = require('./models')

const token = '6571139248:AAEBIwcYmKuYvhYVfowzsSL3WmYu6QWB6rU'
const bot = new TelegramBot(token, {polling: true});
const commands = [
    {command: '/stats', description: 'Show your game stats'},
    {command: '/info', description: 'Find out the available commands'},
    {command: '/game', description: 'Play a mini-game'},
]
let game = null

const dbConnection = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
    } catch (e) {
        console.log('Problem with db connection: ', e)
    }
}
dbConnection()


bot.setMyCommands(commands)

bot.on('message', async (msg) => {
    const chatId = msg.chat.id

    try {
        switch (msg.text) {
            case '/start':
                if (!await UserModel.findOne({ chatId })) {
                    await UserModel.create({ chatId })
                }

                console.log('asd')
                await bot.sendMessage(chatId, 'Hello, my new friend')
                bot.sendMessage(chatId, commands.map(command => `${command.command} - ${command.description}`).join(" \n"))
                break
            case '/game':
                game = new Game(bot, chatId)
                game.startGame()
                break
            case '/stats':
                const user = await UserModel.findOne({ chatId })
                bot.sendMessage(chatId, `In the game you have ${user.right} correct answers out of ${user.allMatches} attempts`)
                break
            case '/info':
                bot.sendMessage(chatId, commands.map(command => `${command.command} - ${command.description}`).join(" \n"))
                break
            default:
                bot.sendMessage(chatId, 'To view the available commands, write "/info"')
        }
    } catch (e) {
        bot.sendMessage(chatId, 'Something wrong. Try later')
    }
})



bot.on('callback_query',async msg => {
    const chatId = msg.message.chat.id
    const { data } = msg

    try {
        if (game) {
            const result = await game.checkResult(data)
            if (!result) {
                game = null
            }
        }
    } catch (e) {
        bot.sendMessage(chatId, 'Something wrong. Try later')
    }
})
