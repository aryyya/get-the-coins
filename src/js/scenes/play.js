import { game } from '../game.js'

export const playState = {

    create () {

        // input
        this.controls = this.getWasdKeys()
        this.cursor = game.input.keyboard.createCursorKeys();

        // mobile input
        if (!game.device.desktop) {
            this.getMobileInputs()
        }

        // player
        this.player = game.add.sprite(game.width / 2, game.height / 2, 'player')
        this.player.anchor.setTo(0.5, 0.5)
        game.physics.arcade.enable(this.player)
        this.player.body.gravity.y = 500
        this.player.animations.add('right', [1, 2], 8, true)
        this.player.animations.add('left', [3, 4], 8, true)

        // walls
        this.createWorld()

        // enemies
        this.enemies = game.add.group()
        this.enemies.enableBody = true
        this.enemies.createMultiple(25, 'enemy')

        // score
        this.scoreLabel = game.add.text(75, 45, '', { font: '20px Geo', fontWeight: 'bold', fill: '#ffffff' })
        this.scoreLabel.anchor.setTo(0.5, 0.5)
        game.global.score = 0

        // bonus
        this.bonus = 9
        this.bonusLabel = game.add.text(420, 45, `${this.bonus}`, { font: '35px Geo', fontWeight: 'bold', fill: '#000000' })
        this.bonusLabel.anchor.setTo(0.5, 0.5)
        game.time.events.loop(1000, () => {
            if (this.bonus > 1) {
                this.bonus -= 1
            }
            this.bonusLabel.text = `${this.bonus}`
        }, this)

        // sounds
        this.jumpSound = game.add.audio('jump')
        this.coinSound = game.add.audio('coin')
        this.deadSound = game.add.audio('dead')

        // coins
        this.lastPosition = { x: 0, y: 0 }
        this.coin = game.add.sprite(0, 0, 'coin')
        game.physics.arcade.enable(this.coin)
        this.coin.anchor.setTo(0.5, 0.5)
        this.updateCoinPosition()
        this.bonusLabel.bringToTop()

        // player particle emitter
        this.playerEmitter = game.add.emitter(0, 0, 15)
        this.playerEmitter.makeParticles('pixel')
        this.playerEmitter.setYSpeed(-150, 150)
        this.playerEmitter.setXSpeed(-150, 150)
        this.playerEmitter.setScale(2, 0, 2, 0, 800)
        this.playerEmitter.gravity = 0

        // coin particle emitter
        this.coinEmitter = game.add.emitter(0, 0, 5)
        this.coinEmitter.makeParticles('yellow-pixel')
        this.coinEmitter.setYSpeed(-150, 150)
        this.coinEmitter.setXSpeed(-150, 150)
        this.coinEmitter.setScale(2, 0, 2, 0, 800)
        this.coinEmitter.gravity = 0
    },

    update () {

        // collisions
        game.physics.arcade.collide(this.player, this.layer)

        // coins
        game.physics.arcade.overlap(this.player, this.coin, () => {
            this.takeCoin()
            this.updateCoinPosition()
        }, null, this)

        // player
        this.movePlayer()
        if (!this.player.inWorld && this.player.alive) {
            this.playerDie()
        }
        this.scoreLabel.x = this.player.x
        this.scoreLabel.y = this.player.y - 25

        // enemies
        game.physics.arcade.collide(this.enemies, this.layer)
        game.physics.arcade.overlap(this.player, this.enemies, () => {
            game.sound.play('hit-monster')
            this.playerDie()
        }, null, this)
    },

    getWasdKeys () {
        return game.input.keyboard.addKeys({
            up: Phaser.KeyCode.W,
            left: Phaser.KeyCode.A,
            down: Phaser.KeyCode.S,
            right: Phaser.KeyCode.D,
            leap: Phaser.KeyCode.SPACEBAR
        })
    },

    getMobileInputs () {
        const jumpButton = game.add.sprite(350, 240, 'jump-button')
        jumpButton.inputEnabled = true
        jumpButton.alpha = 0.5
        jumpButton.events.onInputDown.add(this.jumpPlayer, this)

        const leftButton = game.add.sprite(50, 240, 'left-button')
        leftButton.inputEnabled = true
        leftButton.alpha = 0.5
        this.moveLeft = false
        leftButton.events.onInputOver.add(() => this.moveLeft = true)
        leftButton.events.onInputOut.add(() => this.moveLeft = false)
        leftButton.events.onInputDown.add(() => this.moveLeft = true)
        leftButton.events.onInputUp.add(() => this.moveLeft = false)

        const rightButton = game.add.sprite(130, 240, 'right-button')
        rightButton.inputEnabled = true
        rightButton.alpha = 0.5
        this.moveRight = false
        rightButton.events.onInputOver.add(() => this.moveRight = true)
        rightButton.events.onInputOut.add(() => this.moveRight = false)
        rightButton.events.onInputDown.add(() => this.moveRight = true)
        rightButton.events.onInputUp.add(() => this.moveRight = false)
    },

    movePlayer () {
        const player = this.player
        const controls = this.controls
        const cursor = this.cursor

        // left and right
        if (controls.left.isDown || cursor.left.isDown || this.moveLeft) {
            player.body.velocity.x = -200
            this.player.animations.play('left')
        } else if (controls.right.isDown || cursor.right.isDown || this.moveRight) {
            player.body.velocity.x = +200
            this.player.animations.play('right')
        } else {
            player.body.velocity.x = 0
            this.player.frame = 0
        }

        // jump up
        if ((controls.up.isDown || cursor.up.isDown) && player.body.onFloor()) {
            this.jumpPlayer()
        }

        // fall down
        if ((controls.down.isDown || cursor.down.isDown) && !player.body.touching.down) {
            player.body.velocity.y += 25
        }
    },

    jumpPlayer () {
        if (this.player.body.onFloor()) {
            this.player.body.velocity.y = -320
            this.jumpSound.play()
        }
    },

    createWorld () {

        // create tilemap
        this.map = game.add.tilemap('map')

        // load coin spawn positions
        this.spawns = this.map.objects.spawns.map(({x, y}) => {
            return { x, y }
        })

        // add tileset to map
        this.map.addTilesetImage('tileset')

        // create layer by specifying name
        this.layer = this.map.createLayer('Tile Layer 1')

        // set world size
        this.layer.resizeWorld()

        // enable collisions
        this.map.setCollision(1)
    },

    playerDie () {
        this.deadSound.play()
        this.player.kill()

        this.playerEmitter.x = this.player.x
        this.playerEmitter.y = this.player.y
        this.playerEmitter.start(true, 800, null, 15)

        game.time.events.add(1000, () => {
            game.state.start('menu')
        }, this)
    },

    takeCoin () {
        game.global.score += (1 * this.bonus)
        this.scoreLabel.text = `${game.global.score}`

        this.coinEmitter.x = this.coin.x
        this.coinEmitter.y = this.coin.y
        this.coinEmitter.start(true, 800, null, 15)

        this.addEnemy()
        this.coinSound.play()

        game.add.tween(this.player.scale).to({ x: 1.5, y: 1.5 }, 100).yoyo(true).start()
        game.add.tween(this.scoreLabel.scale).to({ x: 1.5, y: 1.5 }, 100).yoyo(true).start()
    },

    gameObjectSetXY (gameObject, { x, y }) {
        gameObject.x = x
        gameObject.y = y
    },

    getNewCoinPosition () {
        let newPosition = null
        do {
           newPosition = game.rnd.pick(this.spawns)
        } while (this.lastPosition.x === newPosition.x && this.lastPosition.y === newPosition.y)
        return newPosition
    },

    updateCoinPosition () {

        // set to new position
        const newPosition = this.getNewCoinPosition()
        this.lastPosition = newPosition
        this.coin.reset(newPosition.x, newPosition.y)
        
        // bonus countdown
        this.bonusLabel.reset(this.coin.x + 0.5, this.coin.y)
        this.bonus = 9
        this.bonusLabel.text = `${this.bonus}`
    },

    addEnemy () {
        const enemy = this.enemies.getFirstDead()
        const enemySpeeds = [
            80, 100, 120
        ]
        if (enemy) {
            enemy.scale.x = 0.9
            enemy.scale.y = 0.9
            enemy.anchor.setTo(0.5, 1)
            enemy.reset(game.width / 2, 0)
            enemy.body.gravity.y = 750
            enemy.body.velocity.x = game.rnd.pick(enemySpeeds) * game.rnd.pick([-1, 1])
            enemy.body.bounce.x = 1
            enemy.checkWorldBounds = true
            enemy.outOfBoundsKill = true
        }
    }
}
