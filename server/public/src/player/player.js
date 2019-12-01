const playerAnimations = {
  idle: player => {
    if (player.anims.currentAnim.key == "idle") return;
    player.flipX = player.side;
    player.anims.play("idle");
  },
  walk: player => {
    if (player.anims.currentAnim.key == "walk" && player.flipX == player.side)
      return;
    player.flipX = player.side;
    player.anims.play("walk");
  },
  jump: player => {
    if (player.anims.currentAnim.key == "jump") return;
    player.flipX = player.side;
    player.anims.play("jump");
  },
  attack1: player => {
    if (player.anims.currentAnim.key == "attack1") return;
    player.canAnimate = false;
    player.flipX = player.side;
    player.anims.play("attack1");
  }
};

class Player extends BasePlayer {
  constructor(scene, x, y, name, playerId) {
    super(scene, x, y, name, playerId);
    this.remoteState = {};
    this.createAnims(scene);
    this.scaleX = 1;
    this.scaleY = 1;
    this.anims.play("idle");
    this.name = scene.add.text(0, 0, name, {
      fontFamily: '"Roboto Condensed"'
    });
    this.canAnimate = true;
    this.on("animationcomplete", key => {
      if (!this.canAnimate) this.canAnimate = true;
    });
    this.localPlayer = false;
    this.chatMessage = new ChatMessage(this.scene, this, "");
    scene.events.on("update",(time,delta) => this.update());
  }

  setName(name) {
    this.name.text = name;
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
      frames: scene.anims.generateFrameNumbers("player", {
        start: 16,
        end: 22
      }),
      frameRate: 10,
      repeat: -1
    });
    scene.anims.create({
      key: "attack1",
      frames: scene.anims.generateFrameNumbers("player", {
        start: 94,
        end: 99
      }),
      frameRate: 18,
      repeat: 0
    });
  }

  updatePlayerName() {
    this.name.setPosition(
      this.body.position.x,
      this.body.position.y - this.body.height * 0.5
    );
  }

  updateChatMessage() {
    if (this.chatMessage != null) this.chatMessage.update();
  }

  setMessage(text) {
    this.chatMessage.setText(text);
  }

  destroy() {
    this.name.destroy();
    this.chatMessage.destroy();
    super.destroy();
  }

  setIsLocalPlayer() {
    this.localPlayer = true;
  }

  onFinishMovementUpdate() {
    this.updatePlayerName();
  }

  setAnim(anim) {
    if (!this.onAction && playerAnimations[anim]) playerAnimations[anim](this);
  }

  updateRemoteState(state) {
    this.remoteState = state;
  }

  validatePosition() {
    if (
      this.x != this.remoteState.x ||
      Math.abs(this.y.toFixed(1) - this.remoteState.y) > 10
    ) {
      this.x = this.remoteState.x;
      this.y = this.remoteState.y;
    }
  }

  validateState() {
    const state = this.remoteState;
    if (state == null || !state || state == undefined) return;
    this.setVelocityX(state.velocityX);
    this.setVelocityY(state.velocityY);
    this.side = state.side;
    this.onAction = state.onAction;
    this.setAnim(state.anim);
    this.updatePlayerName();
    this.validatePosition();
  }

  validateLocalState() {
    if (state == null || !state || state == undefined) return;
    this.setVelocityX(state.velocityX);
    this.setVelocityY(state.velocityY);
  }

  getRepresentation() {
    return {
      x: this.x,
      y: this.y
    };
  }
}
