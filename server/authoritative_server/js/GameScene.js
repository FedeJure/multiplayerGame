const players = {};
const chatController = new RemoteChatController();
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
      this.addPlayer(socket.id, 0, 30, socket.handshake.query.name);
      socket.emit("connectionSuccess", players[socket.id].getRepresentation());

      chatController.addToChatRoom(socket);

      socket.on("disconnect", () => {
        this.removePlayer(socket.id);
        delete players[socket.id];
        io.emit("disconnect", socket.id);
      });
      socket.on("playerInput", ({input, state}) => {
        players[socket.id].input = input;
        players[socket.id].lastState = state;
      });
    });
    

  }

  update(time, delta) {
    const toSend = {};
    Object.keys(players).forEach(key => {
      const player = players[key];
      player.update();
      toSend[key] = player.getRepresentation();
    })
    io.emit("playersUpdate", toSend);
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
    players[playerId].destroy();
    delete players[playerId];
    window.URL.createObjectURL = blob => {
      if (blob) {
        return datauri.format(
          blob.type,
          blob[Object.getOwnPropertySymbols(blob)[0]]._buffer
        ).content;
      }
    };
    window.URL.revokeObjectURL = objectURL => { };
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
