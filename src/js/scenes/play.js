const playState = {

    create() {

        // input
        this.controls = this.getWasdKeys()
        this.cursor = game.input.keyboard.createCursorKeys();

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
        this.enemies.createMultiple(10, 'enemy')

        // score
        this.scoreLabel = game.add.text(75, 45, '0 points', { font: '20px Geo', fontWeight: 'bold', fill: '#ffffff' })
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

    update() {

        // collisions
        game.physics.arcade.collide(this.player, this.walls, () => {
        })

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
        game.physics.arcade.collide(this.enemies, this.walls)
        game.physics.arcade.overlap(this.player, this.enemies, () => {
            game.sound.play('hit-monster')
            this.playerDie()
        }, null, this)
    },

    getWasdKeys() {
        return game.input.keyboard.addKeys({
            up: Phaser.KeyCode.W,
            left: Phaser.KeyCode.A,
            down: Phaser.KeyCode.S,
            right: Phaser.KeyCode.D
        })
    },

    movePlayer() {
        const player = this.player
        const controls = this.controls
        const cursor = this.cursor

        // left and right
        if (controls.left.isDown || cursor.left.isDown) {
            player.body.velocity.x = -200
            this.player.animations.play('left')
        } else if (controls.right.isDown || cursor.right.isDown) {
            player.body.velocity.x = +200
            this.player.animations.play('right')
        } else {
            player.body.velocity.x = 0
            this.player.frame = 0
        }

        // jump up
        if ((controls.up.isDown || cursor.up.isDown) && player.body.touching.down) {
            player.body.velocity.y = -320
            this.jumpSound.play()
        }

        // fall down
        if ((controls.down.isDown || cursor.down.isDown) && !player.body.touching.down) {
            player.body.velocity.y += 25
        }
    },

    createWorld() {
        this.walls = game.add.group()
        this.walls.enableBody = true
        game.add.sprite(0, 0, 'wallVertical', 0, this.walls) // left
        game.add.sprite(480, 0, 'wallVertical', 0, this.walls) // right
        game.add.sprite(0, 0, 'wallHorizontal', 0, this.walls) // top left
        game.add.sprite(300, 0, 'wallHorizontal', 0, this.walls) // top right
        game.add.sprite(0, 320, 'wallHorizontal', 0, this.walls) // bot left
        game.add.sprite(300, 320, 'wallHorizontal', 0, this.walls) // bot right
        game.add.sprite(-100, 160, 'wallHorizontal', 0, this.walls) // mid left
        game.add.sprite(400, 160, 'wallHorizontal', 0, this.walls) // mid right
        const midTop = game.add.sprite(100, 80, 'wallHorizontal', 0, this.walls)
        const midBot = game.add.sprite(100, 240, 'wallHorizontal', 0, this.walls)
        midTop.scale.setTo(1.5, 1)
        midBot.scale.setTo(1.5, 1)
        this.walls.setAll('body.immovable', true)
    },

    playerDie() {
        this.deadSound.play()
        this.player.kill()

        this.playerEmitter.x = this.player.x
        this.playerEmitter.y = this.player.y
        this.playerEmitter.start(true, 800, null, 15)

        game.time.events.add(1000, () => {
            game.state.start('menu')
        }, this)
    },

    takeCoin() {
        game.global.score += (5 * this.bonus)
        this.scoreLabel.text = `${game.global.score}`

        this.coinEmitter.x = this.coin.x
        this.coinEmitter.y = this.coin.y
        this.coinEmitter.start(true, 800, null, 15)

        this.addEnemy()
        this.coinSound.play()

        this.coin.scale.setTo(0, 0)
        game.add.tween(this.coin.scale).to({ x: 1, y: 1 }, 250).easing(Phaser.Easing.Cubic.InOut).start()
        game.add.tween(this.player.scale).to({ x: 1.5, y: 1.5 }, 100).yoyo(true).start()
        game.add.tween(this.scoreLabel.scale).to({ x: 1.2, y: 1.2 }, 100).yoyo(true).start()
    },

    updateCoinPosition() {
        const positions = [
            { x: 140, y: 60 },
            { x: 360, y: 60 },
            { x: 60, y: 140 },
            { x: 440, y: 140 },
            { x: 130, y: 300 },
            { x: 370, y: 300 }
        ]
        positions.forEach((position, index) => {
            if (position.x === this.coin.x && position.y === this.coin.y) {
                positions.splice(index, 1)
            }
        })
        const newPosition = game.rnd.pick(positions)
        this.coin.reset(newPosition.x, newPosition.y)
        this.bonus = 9
        this.bonusLabel.x = this.coin.x + 0.5
        this.bonusLabel.y = this.coin.y
        this.bonusLabel.text = `${this.bonus}`
    },

    addEnemy() {
        const enemy = this.enemies.getFirstDead()
        if (enemy) {
            enemy.anchor.setTo(0.5, 1)
            enemy.reset(game.width / 2, 0)
            enemy.body.gravity.y = 750
            enemy.body.velocity.x = 100 * game.rnd.pick([-1, 1])
            enemy.body.bounce.x = 1
            enemy.checkWorldBounds = true
            enemy.outOfBoundsKill = true
        }
    }
}
