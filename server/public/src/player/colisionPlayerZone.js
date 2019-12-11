
class ColisionPlayerZone extends Phaser.GameObjects.Rectangle {
    constructor(scene, owner) {
        super(scene, 0  , owner.y, 10, owner.height);
        this.y = owner.y;
        scene.physics.add.existing(this)
        this.body.setAllowGravity(false);
        console.log(this)
    }
}