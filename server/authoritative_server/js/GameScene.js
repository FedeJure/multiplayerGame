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
    this.createTerrain();
    this.initPlatforms();
    io.on("connection", socket => {
      //players[socket.id] = CreatePlayer(socket.id, 0, 30,socket.name);
      this.addPlayer(socket.id, 0, 30,socket.name);
      
      socket.emit("connectionSuccess",socket.id);


      socket.on("disconnect", () => {
        this.removePlayer(socket.id);
        delete players[socket.id];
        io.emit("disconnect", socket.id);
      });

      socket.on("setPlayerName", ({id, name}) => {
        players[id].name = name;
        socket.emit("currentPlayers",Object.values(players).map(player => player.getRepresentation()) );
        socket.broadcast.emit("newPlayer", players[socket.id].getRepresentation());
      });

      socket.on("playerInput", inputData => {
        this.handlePlayerInput(socket.id, inputData);
      });
    });

  }

  update(time, delta) {
    /*this.players.getChildren().forEach(player => {
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
      if (!input.left && !input.right && grounded)
        this.setAnim(playerModel, "idle");
      player.setVelocityX(velocityX);
      if (grounded && input.attack1 && !playerModel.onAction) {
        //attack
        this.setAnim(playerModel, playerModel.attacks.attack1.anim);
        playerModel.onAction = true;
        setTimeout(() => {
          playerModel.onAction = false;
        }, playerModel.attacks.attack1.duration);
      }
      //console.log("PLAYER POSITION: X:",player.x," Y: ",player.y);
      playerModel.x = player.x;
      playerModel.y = player.y;
      playerModel.velocityX = player.body.velocity.x;
      playerModel.velocityY = player.body.velocity.y;
      playerModel.grounded = grounded;
      playerModel.rotation = player.rotation;
    });
    //this.physics.world.wrap(this.players, -1);
    io.emit("playerUpdates", players);*/
  }

  addPlayer(id, x, y, name) {

    const player = new HeadlessPlayer(this, x, y, name, id, this.controls);
    this.physics.add.existing(player); 
    this.add.existing(player);
    player.setDrag(100);
    player.setAngularDrag(100);
    player.setCollideWorldBounds(false);
    this.players.add(player);
    players[id] = player;
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
    players[playerId].update(input)
    io.emit("playerUpdates", players[playerId].getRepresentation());
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
    this.platforms.addMultiple([
      new Phaser.GameObjects.Rectangle(
        this,
        -1000,
        platformY,
        10,
        1000,
        0,
        100
      ),
      new Phaser.GameObjects.Rectangle(this, 2000, platformY, 10, 1000, 0, 10)
    ]);  
  }
}
