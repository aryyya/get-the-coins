// game object
const game = new Phaser.Game(
    500, // width
    340  // height
)

// game globals
game.global = {
    score: 0
}

// game scenes
game.state.add('boot', bootState)
game.state.add('load', loadState)
game.state.add('menu', menuState)
game.state.add('play', playState)

// start first scene
game.state.start('boot')
