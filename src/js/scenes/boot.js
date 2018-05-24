const bootState = {

    preload () {

        // assets path
        game.load.path = './assets/'

        // load assets
        game.load.image('progressBar', 'progressBar.png')
    },

    create () {

        // initial settings
        game.stage.backgroundColor = '#3498db'
        game.physics.startSystem(Phaser.Physics.ARCADE)
        game.renderer.renderSession.roundPixels = true

        // start next state
        game.state.start('load')
    }
}
