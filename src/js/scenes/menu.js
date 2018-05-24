const menuState = {

    create () {

        // show background image
        game.add.image(0, 0, 'background')

        // show game title
        const nameLabel = game.add.text(game.width / 2, 80, 'Get the Coins!', { font: '50px Arial', fill: '#ffffff' })
        nameLabel.anchor.setTo(0.5, 0.5)

        // show score
        const scoreLabel = game.add.text(game.width / 2, game.height / 2, `score: ${game.global.score}`, { font: '25px Arial', fill: '#ffffff' })
        scoreLabel.anchor.setTo(0.5, 0.5)

        // show instructions
        const startLabel = game.add.text(game.width / 2, game.height - 80, 'press w to start', { font: '25px Arial', fill: '#ffffff' })
        startLabel.anchor.setTo(0.5, 0.5)

        // create input key
        const wKey = game.input.keyboard.addKey(Phaser.KeyCode.W)
        wKey.onDown.add(this.start, this)

        // start background music
        if (!this.music) {
            this.music = game.add.audio('music')
            this.music.loop = true
            this.music.volume = 0.75;
            this.music.play()
        }
    },

    start () {

        // start next state
        game.state.start('play')
    }
}
