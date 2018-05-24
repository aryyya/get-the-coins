const loadState = {

    preload () {

        // show loading label
        const loadingLabel = game.add.text(game.width / 2, 150, 'loading...', { font: '30px Arial', fill: '#ffffff' })
        loadingLabel.anchor.setTo(0.5, 0.5)

        // show progress bar
        const progressBar = game.add.sprite(game.width / 2, 200, 'progressBar')
        progressBar.anchor.setTo(0.5, 0.5)
        game.load.setPreloadSprite(progressBar)

        // assets path
        game.load.path = './assets/'

        // load image assets
        game.load.image('player', 'player.png')
        game.load.image('enemy', 'enemy.png')
        game.load.image('coin', 'coin.png')
        game.load.image('wallVertical', 'wallVertical.png')
        game.load.image('wallHorizontal', 'wallHorizontal.png')
        game.load.image('background', 'background.png')

        // load audio assets
        game.load.audio('got-coin', 'got-coin.wav')
        game.load.audio('hit-monster', 'hit-monster.wav')
        game.load.audio('player-died', 'player-died.wav')
        game.load.audio('player-jumped', 'player-jumped.wav')
    },

    create () {

        // start next state
        game.state.start('menu')
    }
}
