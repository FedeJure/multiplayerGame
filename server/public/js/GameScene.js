class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainGame", active: true });
    this.playAnimations = {
      idle: (player, info) => {
        if (player.anims.currentAnim.key == "idle") return;
        player.scaleX = info.side;
        player.anims.play("idle");
      },
      walk: (player, info) => {
        if (
          player.anims.currentAnim.key == "walk" &&
          player.scaleX == info.side
        )
          return;
        player.scaleX = info.side;
        player.anims.play("walk");
      },
      jump: (player, info) => {
        if (player.anims.currentAnim.key == "jump") return;
        player.scaleX = info.side;
        player.anims.play("jump");
      },
      attack1: (player, info) => {
        if (player.anims.currentAnim.key == "attack1") return;
        player.canAnimate = false;
        console.log(player)
        player.scaleX = info.side;
        player.anims.play("attack1");
      }
    };
  }

  displayPlayers(playerInfo, sprite) {
    const player = this.add
      .sprite(playerInfo.x, playerInfo.y, "player")
      .setOrigin(0.5, 0.5)
      .setDisplaySize(53, 40);
    player.playerId = playerInfo.playerId;
    player.anims.play("idle");
    player.name = this.add.text(0, 0, playerInfo.name, {
      fontFamily: '"Roboto Condensed"'
    });
    this.updatePlayerName(player, playerInfo);
    player.canAnimate = true;
    player.on("animationcomplete", key => {
      if (!player.canAnimate) player.canAnimate = true;
    });
    this.players.add(player);
    return player;
  }

  preload() {
    this.load.spritesheet("player", "assets/player_anims.png", {
      frameWidth: 50,
      frameHeight: 37
    });
    this.load.image("background", "./assets/background.png");
    this.load.image("ground", "./assets/simple_platform.png");
    this.controls = this.input.keyboard.addKeys({
      up: "W",
      down: "S",
      left: "A",
      right: "D",
      jump: "SPACE",
      attack1: "U",
      attack2: "I",
      attack3: "O"
    });
  }

  create() {
    this.socket = io();
    this.players = this.add.group();
    this.cameras.main.setBackgroundColor("#ccccff");

    this.createAnims();

    this.socket.on("connectionSuccess", (id) => {
      this.socket.emit("setPlayerName",{id: id, name: localStorage.getItem("playerName")});
    });

    this.socket.on("currentPlayers", players => {
      Object.keys(players).forEach(id => {
        if (players[id].playerId === this.socket.id) {
          this.cameras.main.setBounds(-700, 0, 3000, 300);
          this.cameras.main.startFollow(
            this.displayPlayers(players[id], "player")
          );
          this.player = players[id];
        } else {
          this.displayPlayers(players[id], "player"); //para cargar jugadores distintos al local.
        }
      });
    });

    this.socket.on("newPlayer", playerInfo => {
      this.displayPlayers.bind(this)(playerInfo, "player");
    });

    this.socket.on("disconnect", playerId => {
      this.players.getChildren().forEach(player => {
        if (playerId === player.playerId) {
          player.name.destroy();
          player.destroy();
        }
      });
    });

    this.socket.on("playerUpdates", players => {
      Object.keys(players).forEach(id => {
        this.players.getChildren().forEach(player => {
          if (players[id].playerId === player.playerId) {
            if (player.canAnimate)
              this.playAnimations[players[id].anim](player, players[id]);
            player.setRotation(players[id].rotation);
            player.setPosition(players[id].x, players[id].y);
            this.updatePlayerName(player, players[id]);
          }
        });
      });
    });

    this.cursors = this.input.keyboard.createCursorKeys();
    this.leftKeyPressed = false;
    this.rightKeyPressed = false;
    this.upKeyPressed = false;
    this.attack1KeyPressed = false;

    this.createTerrain();
    this.initPlatforms();
  }

  updatePlayerName(player, playerInfo) {
    player.name.setPosition(
      playerInfo.x - player.width / 2,
      playerInfo.y - player.height
    );
  }

  checkAnimations(playerInfo, player) {
    if (playerInfo.velocityY < 0 && player.anims.currentAnim.key != "jump") {
      player.anims.play("jump");
      return;
    }
    if (
      playerInfo.velocityX > 0 &&
      (player.anims.currentAnim.key != "walk" || player.scaleX < 0)
    ) {
      player.scaleX = Math.abs(player.scaleX);
      player.anims.play("walk");
      return;
    }
    if (
      playerInfo.velocityX < 0 &&
      (player.anims.currentAnim.key != "walk" || player.scaleX > 0)
    ) {
      player.scaleX = -Math.abs(player.scaleX);
      player.anims.play("walk");
      return;
    }
    if (playerInfo.velocityX == 0 && player.anims.currentAnim.key != "idle") {
      player.anims.play("idle");
      return;
    }
  }

  update() {
    const left = this.leftKeyPressed;
    const right = this.rightKeyPressed;
    const up = this.upKeyPressed;
    const attack1 = this.attack1KeyPressed;

    this.leftKeyPressed = this.controls.left.isDown;
    this.rightKeyPressed = this.controls.right.isDown;
    this.upKeyPressed = this.controls.jump.isDown;

    this.attack1KeyPressed = this.controls.attack1.isDown;

    if (
      left !== this.leftKeyPressed ||
      right !== this.rightKeyPressed ||
      up !== this.upKeyPressed ||
      attack1 !== this.attack1KeyPressed
    ) {
      this.socket.emit("playerInput", {
        left: this.leftKeyPressed,
        right: this.rightKeyPressed,
        up: this.upKeyPressed,
        didJump: !up && this.upKeyPressed,
        attack1: this.attack1KeyPressed && !attack1
      });
    }
  }

  createTerrain() {
    const background = this.add.image(1250, 300, "background");
    background.height = config.height;
    background.scaleY = 2;
    background.scaleX = 2;
  }

  createAnims() {
    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("player", { start: 8, end: 13 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("player", { start: 0, end: 2 }),
      frameRate: 5,
      repeat: -1
    });
    this.anims.create({
      key: "jump",
      frames: this.anims.generateFrameNumbers("player", { start: 16, end: 22 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "attack1",
      frames: this.anims.generateFrameNumbers("player", { start: 94, end: 99 }),
      frameRate: 18,
      repeat: 0
    });

  }

  initPlatforms() {
    const platforms = this.add.group();
    var platformCount = 7;
    var platformY = config.height * 0.95;
    var lastPlatformX = -config.width * 0.5;
    for (var i = 0; i < platformCount; i++) {
      platforms.create(lastPlatformX, platformY, "ground");
      lastPlatformX += config.width * 0.5;
    }
    platforms.addMultiple([
      new Phaser.GameObjects.Rectangle(
        this,
        lastPlatformX,
        platformY,
        10,
        1000,
        0,
        100
      ),
      new Phaser.GameObjects.Rectangle(this, 60, platformY, 10, 1000, 0, 10)
    ]);
  }
}
