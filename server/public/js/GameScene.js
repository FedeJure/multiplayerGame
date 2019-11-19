const players = {};
let savedInput = {
  leftKeyPressed: false,
  rightKeyPressed: false,
  upKeyPressed: false,
  attack1KeyPressed: false
};
let localPlayer = null;
class MainScene extends Phaser.Scene {

  constructor() {
    super({ key: "MainGame", active: true });

  }

  displayPlayers(playerInfo, sprite) {
    const player = new Player(this, playerInfo,this.controls);
    this.physics.add.existing(player); 
    this.add.existing(player);
    player.setDrag(100);
    player.setAngularDrag(100);
    player.setCollideWorldBounds(false);
    players[player.playerId] = player;
    this.physics.add.collider(player, this.platforms);
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
          this.cameras.main.zoom = 1;
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

    this.createTerrain();
    this.initPlatforms();
  }

  update() {
    const input = {
      left : this.controls.left.isDown,
      right : this.controls.right.isDown,
      up : this.controls.jump.isDown,
      didJump : !up && this.controls.jump.isDown,
      attack1KeyPressed : this.controls.attack1.isDown,
    }
    if (localPlayer != null) {
      localPlayer.update(input);
    }

    if (
      savedInput.leftKeyPressed !== input.left ||
      savedInput.rightKeyPressed !== input.right ||
      savedInput.upKeyPressed !== input.up ||
      savedInput.attack1KeyPressed !== input.attack1KeyPressed
    ) {
      this.socket.emit("playerInput", input);
    }
    savedInput = {...input};
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

