  const SIDE = { left: true, right: false };
  
  const initialJumps = 2;
  
  class HeadlessPlayer extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, name, playerId, controls) {
      super(scene, x, y, "player");
      this.controls = controls;
      this.setOrigin(0.5, 0.5);
      this.playerId = playerId;
      this.scaleX = 1;
      this.scaleY = 1;
      this.jumps = initialJumps;
      this.side = SIDE.right;
    }
  
    updateState(playerInfo) {
        this.setRotation(playerInfo.rotation);
        this.setPosition(playerInfo.x, playerInfo.y);
        this.updatePlayerName();
    }
  
    update(input) {
      var grounded = this.body.touching.down;
      this.grounded = grounded;
      var velocityX = 0;
  
      var left = () => (velocityX -= 300);
      var right = () => (velocityX += 300);
  
      if (!input.didJump) {
        this.canJump = true;
      }
      if (!grounded) {
        velocityX = this.body.velocity.x;
      }
      if (input.left && grounded) {
        left();
        this.side = SIDE.left;
      }
      if (input.right && grounded) {
        right();
        this.side = SIDE.right;
      }
      if (this.jumps > 0 && input.up && input.didJump && this.canJump) {
        if (input.left && !grounded) {
          velocityX = -300;
          this.side = SIDE.left;
        }
        if (input.right && !grounded) {
          velocityX = 300;
          this.side = SIDE.right;
        }
        this.body.setVelocityY(-500);
        this.jumps -= 1;
        this.canJump = false;
      }
      if (grounded && !input.didJump) {
        this.restartJumps();
      }
      this.body.setVelocityX(velocityX);
      if (grounded && input.attack1 && !this.onAction) {
        //attack
        this.onAction = true;
        setTimeout(() => {
          this.onAction = false;
        }, 500 /*this.attacks.attack1.duration*/);
      }
    }

  
    restartJumps() {
      this.jumps = initialJumps;
    }

    getRepresentation() {
        return {
            x: this.x,
            y: this.y,
            velocityX: this.body.velocity.x,
            velocityY: this.body.velocity.y,
            side: this.side,
            jumps: this.jumps,
            grounded: this.grounded,
            playerId: this.playerId,
        }
    }
  }
  