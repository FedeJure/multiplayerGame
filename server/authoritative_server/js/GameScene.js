const players = {};

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "gameScene" });
  }

  preload() {
    this.load.image("player", "assets/player.png");
    this.load.image("background", "./assets/background.png");
    this.load.image("ground", "./assets/simple_platform.png");
  }

  create() {
    this.players = this.physics.add.group();
    io.on("connection", socket => {
      players[socket.id] = CreatePlayer(socket.id, 0, 30);
      this.addPlayer(players[socket.id]);
      socket.emit("currentPlayers", players);
      socket.broadcast.emit("newPlayer", players[socket.id]);

      socket.on("disconnect", () => {
        this.removePlayer(socket.id);
        delete players[socket.id];
        io.emit("disconnect", socket.id);
      });

      socket.on("playerInput", inputData => {
        this.handlePlayerInput(socket.id, inputData);
      });
    });
    this.createTerrain();
    this.initPlatforms();
  }

  update(time, delta) {
    this.players.getChildren().forEach(player => {
      const playerModel = players[player.playerId];
      const input = playerModel.input;
      var grounded = player.body.touching.down;
      var velocityX = 0;

      var left = () => (velocityX -= 300);
      var right = () => (velocityX += 300);

      if (!input.didJump) {
        playerModel.canJump = true;
      }
      if (!grounded) {
        velocityX = player.body.velocity.x;
      }
      if (input.left && grounded) {
        left();
        this.setAnim(playerModel, "walk");
        playerModel.side = SIDE.left;
      }
      if (input.right && grounded) {
        right();
        this.setAnim(playerModel, "walk");
        playerModel.side = SIDE.right;
      }
      if (
        playerModel.jumps > 0 &&
        input.up &&
        input.didJump &&
        playerModel.canJump
      ) {
        if (input.left && !grounded) {
          velocityX = -300;
          playerModel.side = SIDE.left;
        }
        if (input.right && !grounded) {
          velocityX = 300;
          playerModel.side = SIDE.right;
        }
        player.setVelocityY(-500);
        playerModel.jumps -= 1;
        this.setAnim(playerModel, "jump");
        playerModel.canJump = false;
      }
      if (grounded && !input.didJump) {
        playerModel.restartJumps();
      }
      if (!input.left && !input.right && grounded) this.setAnim(playerModel, "idle");
      player.setVelocityX(velocityX);
      if (grounded && input.attack1) {
        //attack
        this.setAnim(playerModel, "attack1");
        playerModel.onAction = true;
        setTimeout(() => {
          playerModel.onAction = false;
        }, 250);
      }
      console.log(playerModel.onAction);
      playerModel.x = player.x;
      playerModel.y = player.y;
      playerModel.velocityX = player.body.velocity.x;
      playerModel.velocityY = player.body.velocity.y;
      playerModel.grounded = grounded;
      playerModel.rotation = player.rotation;
    });
    this.physics.world.wrap(this.players, 5);
    io.emit("playerUpdates", players);
  }

  setAnim(model, anim) {
    if (!model.onAction) model.anim = anim;
  }

  addPlayer(playerInfo) {
    const player = this.physics.add
      .sprite(playerInfo.x, playerInfo.y, playerInfo.image)
      .setOrigin(0.5, 0.5)
      .setDisplaySize(53, 40);
    player.setDrag(100);
    player.setAngularDrag(100);
    player.playerId = playerInfo.playerId;
    playerInfo.physic = player;
    this.players.add(player);
    this.physics.add.collider(player, this.platforms);
  }

  removePlayer(playerId) {
    this.players.getChildren().forEach(player => {
      if (playerId === player.playerId) {
        player.destroy();
      }
    });
    window.URL.createObjectURL = blob => {
      if (blob) {
        return datauri.format(
          blob.type,
          blob[Object.getOwnPropertySymbols(blob)[0]]._buffer
        ).content;
      }
    };
    window.URL.revokeObjectURL = objectURL => {};
  }

  handlePlayerInput(playerId, input) {
    this.players.getChildren().forEach(player => {
      if (playerId === player.playerId) {
        players[player.playerId].input = input;
      }
    });
  }

  createTerrain() {
    const background = this.add.image(1250, 300, "background");
    background.height = config.height;
    background.scaleY = 2;
    background.scaleX = 2;
  }

  initPlatforms() {
    this.platforms = this.physics.add.staticGroup();
    var platformCount = 7;
    var platformY = config.height * 0.95;
    var lastPlatformX = -config.width * 0.5;
    for (var i = 0; i < platformCount; i++) {
      this.platforms.create(lastPlatformX, platformY, "ground");
      lastPlatformX += config.width * 0.5;
    }
    this.physics.add.collider(Phaser.GameObjects.Rectangle);
    // this.platforms.addMultiple([
    //   new Phaser.GameObjects.Rectangle(
    //     this,
    //     lastPlatformX,
    //     platformY,
    //     10,
    //     1000,
    //     0,
    //     100
    //   ),
    //   new Phaser.GameObjects.Rectangle(this, 60, platformY, 10, 1000, 0, 10)
    // ]);
  }
}
