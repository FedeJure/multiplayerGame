class ChatMessage extends Phaser.GameObjects.Container {
  constructor(scene, parent, text) {
    const message = scene.add.text(0, 0, text, {
      fontFamily: "Roboto Condensed",
      fontSize: 10,
      align: "center",
      color: "#000000",
      wordWrap: { width: parent.width, useAdvancedWrap: true }
    });
    message.setMaxLines(5);
    const box = new Phaser.GameObjects.Rectangle(
      scene,
      0,
      5,
      message.width * 1.1,
      message.height * 1.1,
      Phaser.Display.Color.HexStringToColor("#F5DEB3").color
    );
    box.alpha = 0.5;
    super(scene, 0, 0, [box, message]);

    scene.add.existing(this);
    this.parent = parent;
    this.box = box;
    this.message = message;
    this.timeoutHandle = null;
    this.scene = scene;
  }

  update() {
    this.setPosition(
      this.parent.body.position.x,
      this.parent.body.position.y - 13 * (this.box.height / 13) - 15
    );
  }

  setText(text) {
    window.clearTimeout(this.timeoutHandle);
    this.message.setText(text);
    this.active = true;
    const timeToShow =
      this.message.text.length * 100 < 1000
        ? 1000
        : this.message.text.length * 100;
    this.box.setSize(this.message.width * 1.1, this.message.height * 1.1);
    this.timeoutHandle = setTimeout(() => {
      this.active = false;
      this.message.text = "";
      this.box.setSize(0, 0);
    }, timeToShow);
  }
}
