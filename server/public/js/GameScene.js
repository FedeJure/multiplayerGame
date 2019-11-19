const players = {};
let localPlayer = null;
class MainScene extends Phaser.Scene {

  constructor() {
    super({ key: "MainGame", active: true });

  }

  displayPlayers(playerInfo, sprite) {
    const player = new Player(this, playerInfo,this.controls);
    this.physics.add.existing(player); 
    this.add.existing(player); 
    console.log(player)     
    player.setDrag(100);
    player.setAngularDrag(100);
    player.setCollideWorldBounds(true);
    players[player.playerId] = player;
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
    this.cameras.main.setBackgroundColor("#ccccff");

    this.socket.on("connectionSuccess", (id) => {
      this.socket.emit("setPlayerName",{id: id, name: localStorage.getItem("playerName")});
    });

    this.socket.on("currentPlayers", players => {
      Object.keys(players).forEach(id => {
        if (players[id].playerId === this.socket.id) {
          //his.cameras.main.setBounds(-700, 300, 3000, 0);
          const createdPlayer = this.displayPlayers(players[id], "player");
          this.cameras.main.startFollow(
            createdPlayer
          );
          this.cameras.main.zoom = 2;
          createdPlayer.setIsLocalPlayer();
          localPlayer = createdPlayer;
        } else {
          this.displayPlayers(players[id], "player"); //para cargar jugadores distintos al local.
        }
      });
    });

    this.socket.on("newPlayer", playerInfo => {
      this.displayPlayers.bind(this)(playerInfo, "player");
    });

    this.socket.on("disconnect", playerId => {
      Object.keys(players).forEach(id => {
        if (playerId === players[id].playerId) {
          players[id].destroy();
        }
      });
    });

    /*this.socket.on("playerUpdates", incommingPlayerInfos => {
      Object.keys(players).forEach(id => {
        players[id].updateState(incommingPlayerInfos[id]);
      });

    });*/

    this.cursors = this.input.keyboard.createCursorKeys();
    this.leftKeyPressed = false;
    this.rightKeyPressed = false;
    this.upKeyPressed = false;
    this.attack1KeyPressed = false;

    this.createTerrain();
    this.initPlatforms();
  }

  update() {
    if (localPlayer != null) {
      localPlayer.update();
    }
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


  initPlatforms() {
    const platforms = this.physics.add.staticGroup();
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

