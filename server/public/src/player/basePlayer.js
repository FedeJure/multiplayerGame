const SIDE = { left: true, right: false };
const playerConfig = {
  height: 37,
  width: 30
}
let playerColisionables = null
class BasePlayer extends Phaser.GameObjects.Container {
  constructor(scene, name, playerId) {
    super(scene, 0, 0, []);

    this.nameText = name;
    this.playerId = playerId;

    this.initProperties();

  }



  initProperties() {
    this.eventEmitter = new Phaser.Events.EventEmitter();
    this.initialJumps = 2;
    this.jumps = this.initialJumps;
    this.side = SIDE.right;
    this.canJump = false
    this.canMove = true;
    this.runVelocity = 300;
    this.jumpVelocity = 500;
    this.auxVelocityX = 0;
    this.height = playerConfig.height;
    this.width = playerConfig.width;
    this.attackSystem = new AttackSystem(this);
    this.inInertia = false;
  }

  destroy() {
    super.destroy();
  }

  update() {
    const input = this.input;
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

    //ATTACKS
    if (input.attack1) {
      this.attackSystem.attack1(input, () => {
        this.inInertia = true;
        this.canMove = false;   
        this.setAnim("attack1", true);
      }, () => {
        this.inInertia = false;
        this.canMove = true;   
        
      });
      this.inInertia = true;
    }

    if(this.inInertia) {
      this.auxVelocityX = this.body.velocity.x;
    }

    //MOVEMENT
    if (this.canMove) {
      if (!input.didJump) {
        this.canJump = true;
      }
      /*if (!grounded) {
        this.auxVelocityX = this.body.velocity.x;
      }*/
      if (input.left && grounded) {
        left();
        this.setAnim("walk");
      }
      if (input.right && grounded) {
        right();
        this.setAnim("walk");
      }
      if (this.jumps > 0 && input.jump && input.didJump && this.canJump) {
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
        this.inInertia = true;
      }
      if (grounded && !input.didJump) {
        this.jumps = this.initialJumps;
        this.inInertia = false;
      }
      if (!input.left && !input.right && grounded) this.setAnim("idle");
    }
    
    this.body.setVelocityX(this.auxVelocityX);  
    this.attackSystem.resetOverlaps();

    this.onFinishMovementUpdate();
  }

  onFinishMovementUpdate() {
    //Replace in derivates classes
  }

  setAnim(anim) {
    this.anim = anim;
  }

  die() {
    //improve die method
    globalEventEmitter.emit("playerDie", this.playerId);
  }

  resetPlayer() {
    this.x = 0;
    this.y = 0;
    this.attackSystem.resetLife();
  }


}

const onPlayerOverlapsOther = (player, other) => {
    if (other.y > player.y + (playerConfig.height / 2)) {
      player.attackSystem.overlaps.down.push(other)                
    }
    if (other.y < player.y - (playerConfig.height / 2)) {
      player.attackSystem.overlaps.up.push(other)                
    }
    if (other.x > player.x) {
      player.attackSystem.overlaps.right.push(other)                
    }
    if (other.x < player.x) {
      player.attackSystem.overlaps.left.push(other)
    }
};

