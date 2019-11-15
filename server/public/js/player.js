const playerAnimations = {
  idle: (player, info) => {
    if (player.anims.currentAnim.key == "idle") return;
    player.scaleX = info.side;
    player.anims.play("idle");
  },
  walk: (player, info) => {
    if (
      player.anims.currentAnim.key == "walk" &&
      player.scaleX == info.side
    )
      return;
    player.scaleX = info.side;
    player.anims.play("walk");
  },
  jump: (player, info) => {
    if (player.anims.currentAnim.key == "jump") return;
    player.scaleX = info.side;
    player.anims.play("jump");
  },
  attack1: (player, info) => {
    if (player.anims.currentAnim.key == "attack1") return;
    player.canAnimate = false;
    player.scaleX = info.side;
    player.anims.play("attack1");
  }
};

class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, playerInfo) {
        super(scene, playerInfo.x, playerInfo.y, "player")
        
        this.setOrigin(0.5, 0.5)
        .setDisplaySize(53, 40);
        this.playerId = playerInfo.playerId;
        this.anims.play("idle");
        this.name = scene.add.text(0, 0, playerInfo.name, {
            fontFamily: '"Roboto Condensed"'
        });
        this.updatePlayerName(playerInfo);
        this.canAnimate = true;
        this.on("animationcomplete", key => {
            if (!this.canAnimate) this.canAnimate = true;
        });
        this.isLocalPlayer = false;
        scene.add.existing(this);
        this.initAnimations();
    }

    initAnimations() {

    }

    updateState(playerInfo) {
      console.log(this.isLocalPlayer)
      if (this.localPlayer) {
        if (this.canAnimate)
          playerAnimations[playerInfo.anim](this, playerInfo);
        this.setRotation(playerInfo.rotation);
        this.setPosition(playerInfo.x, playerInfo.y);
        console.log(this.setPosition)
        this.updatePlayerName(playerInfo);
      }
    }

    updatePlayerName(playerInfo) {
      this.name.setPosition(
        playerInfo.x - this.width / 2,
        playerInfo.y - this.height
      );
    }

    destroy() {
      this.destroy();
      this.name.destroy();
    }

    setIsLocalPlayer() {
      this.localPlayer = true;
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
  
  }