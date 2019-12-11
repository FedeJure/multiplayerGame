const players = {};
let playersGroup = null;
let playersCollidersGroup = null;
let savedInput = {
  leftKeyPressed: false,
  rightKeyPressed: false,
  upKeyPressed: false,
  attack1KeyPressed: false
};
let localPlayer = null;
let localId = null;
let socket = null;
const globalEventEmitter = new Phaser.Events.EventEmitter();
class MainScene extends Phaser.Scene {

  constructor() {
    super({ key: "MainGame", active: true });
  }

  displayPlayers(playerInfo, sprite) {
    const player = new Player(this, playerInfo.name, playerInfo.playerId);
    return player;
  }

  initColliderOnWorld(object) {
    object.body.setCollideWorldBounds(false);
    this.physics.add.collider(object, this.platforms);
  }

  initPhysicObejct(object) {
    this.physics.add.existing(object);
  }

  initDrawable(object) {
    this.add.existing(object);
  }


  preload() {
    this.load.spritesheet("player", "assets/player_anims.png", {
      frameWidth: 50,
      frameHeight: 37
    });
    this.load.image("background", "./assets/background.png");
    this.load.image("ground", "./assets/simple_platform.png");
    initControls(this.input);
    playersGroup = this.physics.add.group();
    playersCollidersGroup = this.physics.add.group();
  }

  create() {
    socket = io({query: {
      name: localStorage.getItem("playerName")
    }});
    this.cameras.main.setBackgroundColor("#ccccff");

    this.physics.add.collider(playersCollidersGroup, playersCollidersGroup);

    socket.on("connectionSuccess", playerState => {
      const newPlayer = this.displayPlayers(playerState);
      this.cameras.main.startFollow(newPlayer);
      this.cameras.main.zoom = 1.1;
      this.cameras.main.setBounds(-10000,-10000,1000000, 10600)
      newPlayer.setIsLocalPlayer();
      localPlayer = newPlayer;
      players[newPlayer.playerId] = newPlayer;
      this.chat.addPlayer(newPlayer);
      this.initPlayersOverlap()

    });

    socket.on("disconnect", playerId => {
      players[playerId].destroy();
      delete players[playerId];
      this.chat.removePlayer(playerId);
    });

    socket.on("playerDie", playerId => {
      if (players[playerId]) {
        players[playerId].resetPlayer();
      }
    });

    socket.on("playersUpdate",playersStates => {
      Object.values(playersStates).forEach(playerState => {
        if (players[playerState.playerId] == null) {
          const newPlayer = this.displayPlayers(playerState);
          players[newPlayer.playerId] = newPlayer;
          this.chat.addPlayer(newPlayer);
          playersGroup.add(newPlayer);
          playersCollidersGroup.add(newPlayer.collisionableZone);
        }
        players[playerState.playerId].updateRemoteState(playerState);
      });
    })
    this.createTerrain();
    this.initPlatforms();
    this.chat = new Chat(this)
    
  }

  update() {
    if (localPlayer == null || localPlayer == undefined) {
      return;
    }
    const input = {
      left : controls.left.isDown,
      right : controls.right.isDown,
      up: controls.up.isDown,
      jump : controls.jump.isDown,
      didJump : !savedInput.up && controls.jump.isDown,
      attack1 : controls.attack1.isDown,
    }
    localPlayer.input = input;
    //localPlayer.update();
    // if (
    //   savedInput.left !== input.left ||
    //   savedInput.right !== input.right ||
    //   savedInput.jump !== input.jump ||
    //   savedInput.didJump !== input.didJump ||
    //   savedInput.attack1 !== input.attack1
    // ) {
      socket.emit("playerInput", {input, state: localPlayer.getRepresentation()});
      savedInput = {...input};
    // }
    Object.keys(players).forEach(playerId => {
      if (playerId != localPlayer.playerId) {
        players[playerId].validateState(); 
      }
    })

    if (!Object.values(input).includes(true)) localPlayer.validatePosition();
    if (controls.lag.isDown) {
      localPlayer.validatePosition();
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

  initPlayersOverlap() {
    this.physics.add.overlap(playersGroup, playersGroup, onPlayerOverlapsOther, null, this);
  }


}

