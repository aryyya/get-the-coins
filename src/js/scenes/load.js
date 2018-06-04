import { game } from '../game.js'

export const loadState = {

    preload () {

        // show loading label
        const loadingLabel = game.add.text(game.width / 2, 150, 'loading...', { font: '32px Geo', fill: '#ffffff' })
        loadingLabel.anchor.setTo(0.5, 0.5)

        // show progress bar
        const progressBar = game.add.sprite(game.width / 2, 200, 'progressBar')
        progressBar.anchor.setTo(0.5, 0.5)
        game.load.setPreloadSprite(progressBar)

        // assets path
        game.load.path = './assets/'

        // load image assets
        game.load.image('tileset', 'tileset.png')
        game.load.tilemap('map', 'map.json', null, Phaser.Tilemap.TILED_JSON)
        game.load.atlasJSONArray('atlas', 'atlas.png', 'atlas.json')

        // load audio assets
        game.load.audio('sounds', ['sounds.ogg', 'sounds.mp3'])
    },

    create () {

        // mark sounds
        game.global.sounds = game.add.audio('sounds')
        game.global.sounds.allowMultiple = true
        game.global.sounds.addMarker('coin', 0, 0.654)
        game.global.sounds.addMarker('dead', 1, 0.510)
        game.global.sounds.addMarker('jump', 2, 0.582)
        game.global.sounds.addMarker('music', 3, 147.548, 0.7, true)

        // start next state
        game.state.start('menu')
    }
}
