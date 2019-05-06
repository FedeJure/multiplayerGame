const SIDE = { left: -1, right: 1 };

const CreatePlayer = (playerId, x, y) => {
  return {
    rotation: 0,
    x,
    y,
    velocityX: 0,
    velocityy: 0,
    playerId: playerId,
    grounded: false,
    image: "player",
    anim: "idle",
    side: SIDE.right,
    onAction: false,
    input: {
      left: false,
      right: false,
      up: false
    },
    jumps: 2,
    restartJumps() {
      this.jumps = 2;
    }
  };
};
class Player {
  constructor(scene, data) {
    const self = this;
    this.scene = scene;
    this.name = data.name;
    scene.load.spritesheet(
      "player",
      "./assets/adventurer/adventurer-v1.5-Sheet.png",
      { frameWidth: 50, frameHeight: 37 }
    );

    this.id = data.id;
    this.physic = null;
    this.velocity = 300;
    this.jumpPower = 700;
    this.canJump = true;
    this.jumps = 2;
    this.x = data.x || 50;
    this.y = data.y || 50;
    this.xVel = 0;
    this.yVel = 0;
    this.scaleX = 1;
    this.sendIdle = false;
    this.jumpAnim = false;
    this.isStand = false;

    this.auxUpdate = () => {};

    this.anims = {
      leftWalk: function() {
        self.physic.scaleX = Math.abs(self.physic.scaleX);
        self.physic.anims.play("walk", true);
      },
      rightWalk: function() {
        self.physic.scaleX = -Math.abs(self.physic.scaleX);
        self.physic.anims.play("walk", true);
      },
      jump: function() {
        self.physic.anims.play("jump", true);
      },
      idle: function() {
        self.physic.anims.play("idle", true);
      }
    };
    //client.emit('player_move', data);
  }

  addColliders() {}

  create() {
    this.physic = this.scene.physics.add.sprite(this.x, this.y, "player", 0);
    //this.scene.physics.add.text(this.x, this.y, this.name, { fontFamily: '"Roboto Condensed"' });
    console.log(this.physic);

    this.physic.setScale(2);
    //this.player.physic.setCollideWorldBounds(true);
    this.scene.physics.add.collider(this.physic, this.scene.platforms);
    this.physic.setBounce(0.1);
  }

  update(time, delta) {
    //this.sendMove();
    this.checkAnimations();
  }

  destroy() {
    this.physic.destroy();
  }

  checkAnimations() {
    var self = this;
    var anims = [];
    if (self.physic.body == undefined) return;
    if (self.physic.body.velocity.x > 0 && !self.jumpAnim) {
      self.anims["leftWalk"]();
    } else if (this.physic.body.velocity.x < 0 && !self.jumpAnim) {
      self.anims["rightWalk"]();
    } else if (
      Math.floor(this.physic.body.velocity.x) == 0 &&
      Math.floor(this.physic.body.velocity.y) == -4
    ) {
      self.anims["idle"]();
    } else if (this.jumpAnim) {
      self.anims["jump"]();
      this.jumpAnim = false;
    }

    anims.forEach(function(anim) {
      self.anims[anim]();
    });
  }

  moveRight(velocity) {
    this.physic.body.setVelocityX(velocity);
    this.xVel = velocity;
  }
  moveLeft(velocity) {
    this.physic.body.setVelocityX(-velocity);
    this.xVel = -velocity;
  }
  stand() {
    this.physic.body.setVelocityX(0);
    this.xVel = 0;
  }
  jump(velocity) {
    this.physic.body.setVelocityY(-velocity);
    this.jumpAnim = true;
    this.yVel = -velocity;
  }

  updateMove(data) {
    this.physic.body.velocity.x = this.xVel = data.xVel;
    this.physic.body.velocity.y = this.yVel = data.yVel;
    if (Math.abs(this.physic.x - data.x) > 2) {
      this.physic.x = data.x;
    }
    if (Math.abs(this.physic.y - data.y) > 2) {
      this.physic.y = data.y;
    }
  }

  updatePosition(data) {
    this.physic.x = data.x;
    this.physic.y = data.y;
  }
}

class LocalPlayer extends Player {
  constructor(scene, data) {
    super(scene, data);
    var self = this;

    this.controls = scene.input.keyboard.addKeys({
      up: "W",
      down: "S",
      left: "A",
      right: "D",
      jump: "SPACE"
    });

    var data = {
      name: this.name,
      x: this.x,
      y: this.y,
      xVel: this.xVel,
      yVel: this.yVel,
      scaleX: this.scaleX
    };
    client.emit("play", data);
  }

  create() {
    super.create();
    this.scene.cameras.main.setBounds(0, 0, 5000, 600);
    this.scene.cameras.main.startFollow(this.physic);
    this.auxUpdate = () => {};
  }

  update(time, delta) {
    var grounded = this.physic.body.touching.down;
    var left = this.controls.left.isDown;
    var right = this.controls.right.isDown;
    var jump = this.controls.jump.isDown;

    if (grounded) {
      client.emit("grounded");
    }

    if (left) {
      client.emit("moveLeft");
      this.sendIdle = true;
    } else if (right) {
      client.emit("moveRight");
      this.sendIdle = true;
    }

    if (jump) {
      client.emit("jump");
      this.sendIdle = true;
    }
    if (!grounded && !jump) {
      client.emit("hasJumped");
    }

    if (grounded && !left && !right && !jump && this.sendIdle) {
      client.emit("stand");
    }
    super.update(time, delta);
  }

  sendMove() {
    if (
      Math.floor(this.physic.body.velocity.x) != 0 ||
      Math.floor(this.physic.body.velocity.y) != -4
    ) {
      client.emit("player_move", {
        x: this.x,
        y: this.y,
        xVel: this.xVel,
        yVel: this.yVel
      });
      this.sendIdle = true;
    } else {
      if (this.sendIdle) {
        client.emit("player_move", {
          x: this.physic.x,
          y: this.physic.y,
          xVel: 0,
          yVel: 0
        });
        this.sendIdle = false;
      }
    }

    this.xVel = this.physic.body.velocity.x;
    this.yVel = this.physic.body.velocity.y;
    this.x = this.physic.x;
    this.y = this.physic.y;
  }
}
