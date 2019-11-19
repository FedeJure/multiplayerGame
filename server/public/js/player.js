const playerAnimations = {
  idle: (player) => {
    if (player.anims.currentAnim.key == "idle") return;
    player.flipX = player.side;
    player.anims.play("idle");
  },
  walk: (player) => {
    if (
      player.anims.currentAnim.key == "walk" &&
      player.flipX == player.side
    )
      return;
      player.flipX = player.side;
    player.anims.play("walk");
  },
  jump: (player) => {
    if (player.anims.currentAnim.key == "jump") return;
    player.flipX = player.side;
    player.anims.play("jump");
  },
  attack1: (player) => {
    if (player.anims.currentAnim.key == "attack1") return;
    player.canAnimate = false;
    player.flipX = player.side;
    player.anims.play("attack1");
  }
};

const SIDE = { left: true, right: false };

const initialJumps = 2;

class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, playerInfo, controls) {
        super(scene, playerInfo.x, playerInfo.y, "player")
        this.controls = controls;
        this.setOrigin(0.5, 0.5)
        this.playerId = playerInfo.playerId;
        this.createAnims(scene);
        this.scaleX = 1;
        this.scaleY = 1;
        this.anims.play("idle");
        this.name = scene.add.text(0, 0, playerInfo.name, {
            fontFamily: '"Roboto Condensed"'
        });
        console.log(this)
        this.canAnimate = true;
        this.on("animationcomplete", key => {
            if (!this.canAnimate) this.canAnimate = true;
        });
        this.isLocalPlayer = false;
        this.jumps = initialJumps;
        this.side = SIDE.right;
    }

    createAnims(scene) {
      scene.anims.create({
        key: "walk",
        frames: scene.anims.generateFrameNumbers("player", { start: 8, end: 13 }),
        frameRate: 10,
        repeat: -1
      });
      scene.anims.create({
        key: "idle",
        frames: scene.anims.generateFrameNumbers("player", { start: 0, end: 2 }),
        frameRate: 5,
        repeat: -1
      });
      scene.anims.create({
        key: "jump",
        frames: scene.anims.generateFrameNumbers("player", { start: 16, end: 22 }),
        frameRate: 10,
        repeat: -1
      });
      scene.anims.create({
        key: "attack1",
        frames: scene.anims.generateFrameNumbers("player", { start: 94, end: 99 }),
        frameRate: 18,
        repeat: 0
      });
  
    }

    updateState(playerInfo) {
      if (this.localPlayer) {
        if (this.canAnimate)
          playerAnimations[playerInfo.anim](this, playerInfo);
        this.setRotation(playerInfo.rotation);
        this.setPosition(playerInfo.x, playerInfo.y);
        this.updatePlayerName();
      }
    }

    updatePlayerName() {
      this.name.setPosition(
        this.body.position.x,
        this.body.position.y - this.body.height * 0.5
      );
    }

    destroy() {
      this.destroy();
      this.name.destroy();
    }

    setIsLocalPlayer() {
      this.localPlayer = true;
    }

    update() {
      const input = {
        left : this.controls.left.isDown,
        right : this.controls.right.isDown,
        up : this.controls.jump.isDown,
        didJump : this.controls.jump.isDown,
        attack1KeyPressed : this.controls.attack1.isDown,
      }

      var grounded = true;
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
        this.setAnim("walk");
        this.side = SIDE.left;
      }
      if (input.right && grounded) {
        right();
        this.setAnim("walk");
        this.side = SIDE.right;
      }
      if (
        this.jumps > 0 &&
        input.up &&
        input.didJump &&
        this.canJump
      ) {
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
        this.setAnim("jump");
        this.canJump = false;
      }
      if (grounded && !input.didJump) {
        this.restartJumps();
      }
      if (!input.left && !input.right && grounded)
        this.setAnim("idle");
      this.body.setVelocityX(velocityX);
      if (grounded && input.attack1 && !this.onAction) {
        //attack
        this.setAnim("attack1");
        this.onAction = true;
        setTimeout(() => {
          this.onAction = false;
        }, 500/*this.attacks.attack1.duration*/);
      }

      this.updatePlayerName();
    }

    setAnim(anim) {
      if (!this.onAction) playerAnimations[anim](this);
    }

      /*checkAnimations(playerInfo, player) {
    if (playerInfo.velocityY < 0 && player.anims.currentAnim.key != "jump") {
      player.anims.play("jump");
      return;
    }
    if (
      playerInfo.velocityX > 0 &&
      (player.anims.currentAnim.key != "walk" || player.scaleX < 0)
    ) {
      player.scaleX = Math.abs(player.scaleX);
      player.anims.play("walk");
      return;
    }
    if (
      playerInfo.velocityX < 0 &&
      (player.anims.currentAnim.key != "walk" || player.scaleX > 0)
    ) {
      player.scaleX = -Math.abs(player.scaleX);
      player.anims.play("walk");
      return;
    }
    if (playerInfo.velocityX == 0 && player.anims.currentAnim.key != "idle") {
      player.anims.play("idle");
      return;
    }
  }*/

  restartJumps() {
    this.jumps = 2;
  }
  
  }