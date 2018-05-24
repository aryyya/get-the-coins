const playState = {

    create() {

        // input
        this.controls = this.getWasdKeys()

        // player
        this.player = game.add.sprite(game.width / 2, game.height / 2, 'player')
        this.player.anchor.setTo(0.5, 0.5)
        game.physics.arcade.enable(this.player)
        this.player.body.gravity.y = 500

        // walls
        this.createWorld()

        // coins
        this.coin = game.add.sprite(60, 140, 'coin')
        game.physics.arcade.enable(this.coin)
        this.coin.anchor.setTo(0.5, 0.5)
        this.updateCoinPosition()

        // enemies
        this.enemies = game.add.group()
        this.enemies.enableBody = true
        this.enemies.createMultiple(10, 'enemy')

        // score
        this.scoreLabel = game.add.text(30, 30, 'score: 0', { font: '18px Arial', fill: '#ffffff' })
        game.global.score = 0
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
        if (!this.player.inWorld) {
            this.playerDie()
        }

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
        if (this.controls.left.isDown) {
            this.player.body.velocity.x = -200
        } else if (this.controls.right.isDown) {
            this.player.body.velocity.x = +200
        } else {
            this.player.body.velocity.x = 0
        }
        if (this.controls.up.isDown && this.player.body.touching.down) {
            game.sound.play('player-jumped')
            this.player.body.velocity.y = -320
            let angle = 0
            if (this.player.body.velocity.x > 0) {
                angle = +720
            } else if (this.player.body.velocity.x < 0) {
                angle = -720
            }
            this.player.jumpTween = game.add.tween(this.player).to({ angle }, 2000).start()
        } else if (this.player.body.touching.down) {
            game.tweens.remove(this.player.jumpTween)
            this.player.angle = 0
        }
        if (this.controls.down.isDown && !this.player.body.touching.down) {
            this.player.body.velocity.y += 25
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
        const deathTween = game.add.tween(this.player).to({ angle: 720, y: screen.height }, 1000).start()
        game.stage.backgroundColor = '#000000'
        deathTween.onComplete.add(() => {
            window.setTimeout(() => {
                game.sound.play('player-died')
                game.state.start('menu')
            }, 500)
        }, this)
    },

    takeCoin() {
        game.sound.play('got-coin')
        game.global.score += 5
        this.scoreLabel.text = `score: ${game.global.score}`
        this.addEnemy()
    },

    updateCoinPosition() {
        const positions = [
            { x: 140, y: 60 },
            { x: 360, y: 60 },
            { x: 60, y: 140 },
            { x: 440, y: 140 },
            { x: 130, y: 300 },
            { x: 370, y: 300 },
            { x: screen.width / 2, y: screen.height / 2 }
        ]
        positions.forEach((position, index) => {
            if (position.x === this.coin.x && position.y === this.coin.y) {
                positions.splice(index, 1)
            }
        })
        const newPosition = game.rnd.pick(positions)
        this.coin.reset(newPosition.x, newPosition.y)
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
