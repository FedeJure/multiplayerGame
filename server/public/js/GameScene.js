const players = {};
let savedInput = {
  leftKeyPressed: false,
  rightKeyPressed: false,
  upKeyPressed: false,
  attack1KeyPressed: false
};
let localPlayer = null;
let localId = null;
class MainScene extends Phaser.Scene {

  constructor() {
    super({ key: "MainGame", active: true });

  }

  displayPlayers(playerInfo, sprite) {
    const player = new Player(this, playerInfo.x, playerInfo.y, playerInfo.name, playerInfo.playerId,this.controls);
    console.log(player)
    this.physics.add.existing(player); 
    this.add.existing(player);
    player.setDrag(100);
    player.setAngularDrag(100);
    player.setCollideWorldBounds(false);
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
      attack3: "O",
      lag: "L"
    });
  }

  create() {
    this.socket = io({query: {
      name: localStorage.getItem("playerName")
    }});
    this.cameras.main.setBackgroundColor("#ccccff");

    this.socket.on("connectionSuccess", playerState => {
      const newPlayer = this.displayPlayers(playerState);
      this.cameras.main.startFollow(
        newPlayer
      );
      this.cameras.main.zoom = 1;
      newPlayer.setIsLocalPlayer();
      localPlayer = newPlayer;
      players[newPlayer.playerId] = newPlayer;
    });

    this.socket.on("disconnect", playerId => {
      Object.keys(players).forEach(id => {
        if (playerId === players[id].playerId) {
          players[id].destroy();
          delete players[id];
        }
      });
    });

    this.socket.on("playersUpdate",playersStates => {
      Object.values(playersStates).forEach(playerState => {
        if (players[playerState.playerId] == null) {
          const newPlayer = this.displayPlayers(playerState);
          players[newPlayer.playerId] = newPlayer;
        }
        players[playerState.playerId].remoteState = playerState;
      });
    })

    this.cursors = this.input.keyboard.createCursorKeys();

    this.createTerrain();
    this.initPlatforms();
  }

  update() {
    if (localPlayer == null || localPlayer == undefined) {
      return;
    }
    const input = {
      left : this.controls.left.isDown,
      right : this.controls.right.isDown,
      up : this.controls.jump.isDown,
      didJump : !savedInput.up && this.controls.jump.isDown,
      attack1KeyPressed : this.controls.attack1.isDown,
    }
    localPlayer.update(input);
    Object.keys(players).forEach(playerId => {
      if (playerId != localPlayer.playerId) {
        const player = players[playerId]; 
        player.validateState();
      }

    })

    if (
      savedInput.left !== input.left ||
      savedInput.right !== input.right ||
      savedInput.up !== input.up ||
      savedInput.attack1 !== input.attack1
    ) {
      this.socket.emit("playerInput", input);
    }
    savedInput = {...input};
    if (this.controls.lag.isDown) {
      localPlayer.validateState()
    }
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

