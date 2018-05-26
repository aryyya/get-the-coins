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
        game.load.spritesheet('player', 'player2.png', 20, 20)
        game.load.spritesheet('mute', 'muteButton.png', 28, 22)
        game.load.image('enemy', 'enemy.png')
        game.load.image('coin', 'coin.png')
        game.load.image('wallVertical', 'wallVertical.png')
        game.load.image('wallHorizontal', 'wallHorizontal.png')
        game.load.image('background', 'background.png')
        game.load.image('pixel', 'pixel.png')
        game.load.image('yellow-pixel', 'yellow-pixel.png')

        // load audio assets
        game.load.audio('got-coin', 'got-coin.wav')
        game.load.audio('hit-monster', 'hit-monster.wav')
        game.load.audio('player-died', 'player-died.wav')
        game.load.audio('player-jumped', 'player-jumped.wav')
        game.load.audio('jump', ['jump.ogg', 'jump.mp3'])
        game.load.audio('coin', ['coin.ogg', 'coin.mp3'])
        game.load.audio('dead', ['dead.ogg', 'dead.mp3'])
        game.load.audio('music', ['background-music.ogg', 'background-music.mp3'])
    },

    create () {

        // start next state
        game.state.start('menu')
    }
}
