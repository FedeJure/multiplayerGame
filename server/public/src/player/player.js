const playerAnimations = {
  idle: (player, force) => {
    if (!force && player.sprite.anims.currentAnim.key == "idle") return;
    player.sprite.flipX = player.side;
    player.sprite.anims.play("idle");
  },
  walk: (player, force) => {
    if (!force && player.sprite.anims.currentAnim.key == "walk" && player.sprite.flipX == player.side)
      return;
    player.sprite.flipX = player.side;
    player.sprite.anims.play("walk");
  },
  jump: (player, force) => {
    if (!force && player.sprite.anims.currentAnim.key == "jump") return;
    player.sprite.flipX = player.side;
    player.sprite.anims.play("jump");
  },
  attack1: (player, force) => {
    if (!force && player.sprite.anims.currentAnim.key == "attack1") return;
    player.sprite.canAnimate = false;
    player.sprite.flipX = player.side;
    player.sprite.anims.play("attack1");
  }
};

class Player extends BasePlayer {
  constructor(scene, name, playerId) {
    super(scene, name, playerId);
    scene.initDrawable(this);
    scene.initPhysicObejct(this);
    scene.initColliderOnWorld(this);
    this.sprite = this.initSprite(scene);
    this.localPlayer = false;
    this.remoteState = {};
    this.createAnims(scene);
    this.scaleX = 1;
    this.scaleY = 1;
    this.sprite.anims.play("idle");
    this.canAnimate = true;
    this.on("animationcomplete", key => {
      if (!this.canAnimate) this.canAnimate = true;
    });
    this.name = this.initName(scene, name);
    this.lifebar = this.initLifeBar(scene);
    this.chatMessage = this.initChatMessage(scene);
    scene.events.on("update",(time,delta) => this.update());

    this.body.setDrag(100);
    this.body.setAngularDrag(100);

  }

  initSprite(scene) {
    const sprite = new Phaser.Physics.Arcade.Sprite(scene, 0, 0, "player")
    sprite.setOrigin(0.5, 0.5);
    sprite.scaleX = 1;
    sprite.scaleY = 1;
    scene.initDrawable(sprite);
    this.add(sprite);
    return sprite;
  }

  initName(scene, nameText) {
    const name = scene.add.text(0, 0, nameText, {
      fontFamily: '"Roboto Condensed"'
    });
    this.add(name);
    name.x -= (name.text.length * 3.5);
    name.y -= playerConfig.height * 1.25;
    return name;
  }

  initChatMessage(scene) {
    const chatMessage = new ChatMessage(scene, this, "");
    this.add(chatMessage)
    chatMessage.x -= playerConfig.width * 0.5;
    chatMessage.y -= playerConfig.height * 1.5;
    return chatMessage
  }

  initLifeBar(scene) {
    const lifebar = new Lifebar(scene, 0, playerConfig.height * 0.7, playerConfig.width, this);
    this.add(lifebar);
    return lifebar
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
  }

  setAnim(anim, force) {
    if (!playerAnimations[anim]) return;
    if (force || !this.onAction) playerAnimations[anim](this, force);
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
    this.body.setVelocityX(state.velocityX);
    this.body.setVelocityY(state.velocityY);
    this.sprite.flipX = state.side;
    this.onAction = state.onAction;
    this.attackSystem.maxLife = state.maxLife;
    this.lifebar.onChangeLife(state.life);
    this.setAnim(state.anim);
    this.validatePosition();
  }

  validateLocalState() {
    if (state == null || !state || state == undefined) return;
    this.body.setVelocityX(state.velocityX);
    this.body.setVelocityY(state.velocityY);
  }

  update() {
    super.update();
    this.lifebar.onChangeLife(this.remoteState.life);
    //actualizo barra de vida
  }

  getRepresentation() {
    return {
      x: this.x,
      y: this.y
    };
  }
}
