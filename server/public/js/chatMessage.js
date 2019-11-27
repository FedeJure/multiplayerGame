
class ChatMessage extends Phaser.GameObjects.Container {
    constructor(scene, parent, text) {
        const message = new Phaser.GameObjects.Text(scene, parent.x - 50, parent.y, text,
            {
                fontFamily: 'Roboto Condensed',
                fontSize: 10,
                align: "center",
                color: "#000000",
                wordWrap: { width: parent.width, useAdvancedWrap: true }
            });
        message.setMaxLines(5)
        const box = new Phaser.GameObjects.Rectangle(scene, message.getCenter().x, message.getCenter().y, message.width * 1.1, message.height * 1.1, Phaser.Display.Color.HexStringToColor("#F5DEB3").color);
        box.alpha = 0.5;
        super(scene, 0, 0, [box, message]);

        this.enabled = true;
        
        scene.add.existing(this);
        this.parent = parent;
        this.box = box;
        this.message = message;
        this.timeoutHandle = null;
    }

    update() {
        this.setPosition(
            this.parent.body.position.x + this.parent.width,
            this.parent.body.position.y - this.parent.body.height - (13 * (this.box.height / 13)) - 10
        );
    }

    setText(text) {
        window.clearTimeout(this.timeoutHandle);
        this.message.text = text;
        this.active = true;
        this.box.setSize(this.message.width * 1.1, this.message.height * 1.1);
        this.timeoutHandle = setTimeout(() => {
            this.active = false;
            this.message.text = "";
            this.box.setSize(0,0);
        }, 5000);
    }
}