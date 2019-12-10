const greenColor = "0x59FF00";
const orangeColor = "0xFF9700";
const redColor = "0xFF0000";

class Lifebar extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y, width, owner) {
        super(scene, 0, 0, width, 5, greenColor);
        this.owner = owner;
        this.x = x;
        this.y = -y;
        this.maxWidth = width;

        this.owner.eventEmitter.addListener("onLifeChange", newLife => {
            this.onChangeLife(newLife)
        });
    }


    onChangeLife(newLife) {
        this.width = (newLife / this.owner.attackSystem.maxLife) * this.maxWidth;
        const percent = this.width / this.maxWidth;
        if (percent <= 1) {
            this.fillColor = greenColor;
        }
        if (percent < 0.75) {
            this.fillColor = orangeColor;
        }
        if (percent < 0.25) {
            this.fillColor = redColor
        }
    }
}