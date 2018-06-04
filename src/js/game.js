import { bootState } from './scenes/boot.js'
import { loadState } from './scenes/load.js'
import { menuState } from './scenes/menu.js'
import { playState } from './scenes/play.js'

// game object
export const game = new Phaser.Game(
    500, // width
    340  // height
)

// game globals
game.global = {
    score: 0,
    sounds: null,
    musicIsPlaying: false
}

// game scenes
game.state.add('boot', bootState)
game.state.add('load', loadState)
game.state.add('menu', menuState)
game.state.add('play', playState)

// start first scene
game.state.start('boot')
