export default class ThirdLevel extends Phaser.Scene {
  constructor() {
    super("thirdLevel");
  }

  init(data) {
    this.score = data.score || 0;
    this.collectedTargets = 0;
  }

  preload() {
    this.load.tilemapTiledJSON("Thirdmap", "public/assets/tilemap/third-map.json");
  }

  create() {
    const map = this.make.tilemap({ key: "Thirdmap" });
    const tileset = map.addTilesetImage("Platform", "tileset2");
    const platformLayer = map.createLayer("Plataformas", tileset, 0, 0);
    const objectsLayer = map.getObjectLayer("Objetos");

    const spawnPoint = map.findObject("Objetos", (obj) => obj.name === "player");

    this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, "dude");
    this.player.body.setCollideWorldBounds(false);

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

    platformLayer.setCollisionByProperty({ esColisionable: true });
    this.physics.add.collider(this.player, platformLayer);

    this.stars = this.physics.add.group();
    this.targets = this.physics.add.group();

    objectsLayer.objects.forEach((objData) => {
      const { x = 0, y = 0, type, name } = objData;
      if (name === "target") {
        const target = this.targets.create(x, y, "star");
        target.setTint(0xff0000);
      }
      if (type === "star") {
        this.stars.create(x, y, "star");
      }
    });

    this.physics.add.collider(this.stars, platformLayer);
    this.physics.add.collider(this.targets, platformLayer);

    this.physics.add.overlap(this.player, this.targets, this.collectTarget, null, this);
    this.physics.add.overlap(this.player, this.stars, this.checkLevelComplete, null, this);

    this.scoreText = this.add.text(16, 16, `Score: ${this.score}`, {
      fontSize: "28px",
      fill: "#000",
    });

    this.targetsText = this.add.text(16, 50, `Targets: 0 / 5`, {
      fontSize: "24px",
      fill: "#000",
    });

    this.messageText = this.add.text(400, 300, "", {
      fontSize: "32px",
      fill: "#ff0000",
      backgroundColor: "#fff",
      padding: { x: 10, y: 5 },
    }).setOrigin(0.5).setVisible(false);

    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play("right", true);
    } else {
      this.player.setVelocityX(0);
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-160);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(160);
    } else {
      this.player.setVelocityY(0);
    }

    if (this.player.body.velocity.x === 0 && this.player.body.velocity.y === 0) {
      this.player.anims.play("turn");
    }

    if (Phaser.Input.Keyboard.JustDown(this.keyR)) {
      this.scene.start("game", { score: this.score });;
    }

    const cam = this.cameras.main;
    this.scoreText.setPosition(cam.worldView.x + 16, cam.worldView.y + 16);
    this.targetsText.setPosition(cam.worldView.x + 16, cam.worldView.y + 50);
    this.messageText.setPosition(cam.worldView.centerX, cam.worldView.centerY);
  }

  collectTarget(player, target) {
    target.disableBody(true, true);
    this.collectedTargets++;
    this.score += 25;
    this.scoreText.setText(`Score: ${this.score}`);
    this.targetsText.setText(`Targets: ${this.collectedTargets} / 5`);
  }

  checkLevelComplete(player, star) {
    if (this.collectedTargets >= 5) {
      this.add.text(
        this.cameras.main.worldView.centerX,
        this.cameras.main.worldView.centerY,
        "¡Ganaste!",
        {
          fontSize: "48px",
          fill: "#0f0",
        }
      ).setOrigin(0.5);
      this.player.setTint(0x00ff00);
      this.physics.pause();
      
    } else {
      this.showTemporaryMessage("¡Recolectá los 5 targets primero!");
    }
  }

  showTemporaryMessage(message) {
    this.messageText.setText(message).setVisible(true);
    this.time.delayedCall(3000, () => {
      this.messageText.setVisible(false);
    });
  }
}
