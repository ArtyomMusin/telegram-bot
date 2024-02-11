const UserModel = require('./models')

module.exports = class Game {
    constructor(bot, chatId) {
        this.chatId = chatId
        this.bot = bot
        this.matches = {}
        this.gameOptions = this._getGameOptions()
        this.count = 0
        this.allTry = 0
    }

    _getGameOptions () {
        return {
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [{text: '7', callback_data: '7'}, {text: '8', callback_data: '8'}, {text: '9', callback_data: '9'}],
                    [{text: '4', callback_data: '4'}, {text: '5', callback_data: '5'}, {text: '6', callback_data: '6'}],
                    [{text: '1', callback_data: '1'}, {text: '2', callback_data: '2'}, {text: '3', callback_data: '3'}],
                    [{text: '0', callback_data: '0'}]
                ]
            })
        }
    }

    _addMatch (value) {
        this.matches[this.chatId] = {
            value,
            finished: false
        }
    }

    _incrementCount () {
        this.count += 1
    }

    _incrementTry () {
        this.allTry += 1
    }

    async startGame () {
        this._incrementTry()
        const randomNumber = Math.floor(Math.random() * 10)
        this._addMatch(randomNumber)
        await this.bot.sendMessage(this.chatId, 'I made a number from 0 to 9, what is this number?', this.gameOptions)
    }

    async checkResult (data) {
        if (data === '/again') {
            this.startGame(this.chatId)
            return true
        }

        if (data === '/stop') {
            this._finishGame()
            return false
        }

        if (Number(data) === this.matches[this.chatId]?.value) {
            this._incrementCount()
            await this.bot.sendMessage(this.chatId, `You guessed it! This is a figure ${this.matches[this.chatId]?.value}`)
        } else {
            await this.bot.sendMessage(this.chatId, `Unfortunately, you made a mistake! It was a figure ${this.matches[this.chatId]?.value}`)
        }
        this._gameContinue()
        return true
    }

    async _gameContinue () {
        const options = {
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [{text: 'Да', callback_data: '/again'}],
                    [{text: 'Нет', callback_data: '/stop'}]
                ]
            })
        }
        this.bot.sendMessage(this.chatId, 'Do you want to try again?', options)
    }

    async _finishGame () {
        const user = await UserModel.findOne({ chatId: this.chatId })
        user.allMatches += this.allTry
        user.right += this.count
        await user.save()
        this.bot.sendMessage(this.chatId, `The game is over. You have guessed ${this.count} numbers out of ${this.allTry}`)
    }
}