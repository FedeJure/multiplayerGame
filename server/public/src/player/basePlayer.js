const SIDE = { left: true, right: false };

class BasePlayer extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, name, playerId) {
    super(scene, x, y, "player");
    this.setOrigin(0.5, 0.5);
    this.playerId = playerId;
    this.nameText = name;
    this.scaleX = 1;
    this.scaleY = 1;
    this.initProperties();
  }

  initProperties() {
    this.initialJumps = 2;
    this.jumps = this.initialJumps;
    this.side = SIDE.right;
    this.canJump = false
    this.runVelocity = 300;
    this.jumpVelocity = 500;
    this.auxVelocityX = 0;
  }


  destroy() {
    super.destroy();
  }

  update(input) {
    if (!input || input == null || input == undefined) return;
    var grounded = this.body.touching.down;
    this.auxVelocityX = 0;
    var left = () => {
      this.auxVelocityX -= this.runVelocity;
      this.side = SIDE.left;
    };
    var right = () => {
      this.auxVelocityX += this.runVelocity;
      this.side = SIDE.right;
    };

    if (!input.didJump) {
      this.canJump = true;
    }
    if (!grounded) {
      this.auxVelocityX = this.body.velocity.x;
    }
    if (input.left && grounded) {
      left();
      this.setAnim("walk");
    }
    if (input.right && grounded) {
      right();
      this.setAnim("walk");
    }
    if (this.jumps > 0 && input.up && input.didJump && this.canJump) {
      if (input.left && !grounded) {
        this.auxVelocityX = 0;
        left();
      }
      if (input.right && !grounded) {
        this.auxVelocityX = 0;
        right();
      }
      this.body.setVelocityY(-this.jumpVelocity);
      this.jumps -= 1;
      this.setAnim("jump");
      this.canJump = false;
    }
    if (grounded && !input.didJump) {
      this.restartJumps();
    }
    if (!input.left && !input.right && grounded) this.setAnim("idle");
    this.body.setVelocityX(this.auxVelocityX);
    if (grounded && input.attack1 && !this.onAction) {
      //attack
      this.setAnim("attack1");
      this.onAction = true;
      setTimeout(() => {
        this.onAction = false;
      }, 500 /*this.attacks.attack1.duration*/);
    }
    this.onFinishMovementUpdate();
  }

  setAnim(anim) {
    this.anim = anim;
  }

  restartJumps() {
    this.jumps = this.initialJumps;
  }
}
