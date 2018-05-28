import { game } from '../game.js'

export const bootState = {

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

        // scaling
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
        game.scale.setMinMax(game.width * 0.75, game.height * 0.75, game.width * 1.25, game.height * 1.25)
        game.scale.pageAlignHorizontally = true
        game.scale.pageAlignVertically = true

        // start next state
        game.state.start('load')
    }
}
