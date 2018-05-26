const menuState = {

    create () {

        // initialize high score local storage
        if (!localStorage['high-score']) {
            localStorage['high-score'] = 0
        }
        
        // set new high score
        let newHighScore = false
        if (game.global.score > localStorage['high-score']) {
            localStorage['high-score'] = game.global.score
            newHighScore = true
        }

        // show background image
        game.add.image(0, 0, 'background')

        // show game title
        const nameLabel = game.add.text(game.width / 2, -50, 'Get the Coins!', { font: '50px Geo', fontWeight: 'bold', fill: '#ffffff' })
        nameLabel.anchor.setTo(0.5, 0.5)
        game.add.tween(nameLabel).to({ y: 80 }, 1000).easing(Phaser.Easing.Bounce.Out).start()

        // show score
        const scoreLabel = game.add.text(game.width / 2, game.height / 2, `high score: ${localStorage['high-score']}`, { font: '24px Geo', fontWeight: 'bold', fill: '#ffffff' })
        scoreLabel.anchor.setTo(0.5, 0.5)
        if (newHighScore) {
            scoreLabel.fill = "yellow"
        }

        // show instructions
        const startLabel = game.add.text(game.width / 2, game.height - 80, 'press SPACEBAR to start', { font: '24px Geo', fontWeight: 'bold', fill: '#ffffff' })
        startLabel.anchor.setTo(0.5, 0.5)
        game.add.tween(startLabel.scale).to({ y: 1.1, x: 1.1 }, 300).yoyo(true).loop().delay(50).start()

        // show mute button
        this.muteButton = game.add.button(20, 20, 'mute', () => {
            game.sound.mute = !game.sound.mute
            this.muteButton.frame = game.sound.mute ? 1 : 0
        }, this)
        this.muteButton.frame = game.sound.mute ? 1 : 0

        // create input key
        const spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        spacebar.onDown.add(this.start, this)

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
