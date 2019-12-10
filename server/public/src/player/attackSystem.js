class AttackSystem  {
    constructor(owner) {
        this.maxLife = 100;
        this.life = this.maxLife;
        this.owner = owner;
        this.attacking = false;
        this.overlaps = {
            left: [],
            right: [],
            up: [],
            down: []
          }
        this.attacks = {
            attack1: {
                duration: 250,
                damage: 10
            }
        }
    }

    attack1(input) {
        if (this.attacking) return;

        const attack = this.attacks.attack1;

        if (input.up) {
            this.overlaps.up.forEach(target => {
                target.attackSystem.takePhysicalDamage(attack.damage, Phaser.RIGHT);
            })
        }
        if (this.owner.side == SIDE.left) {
            this.overlaps.left.forEach(target => {
                target.attackSystem.takePhysicalDamage(attack.damage, Phaser.RIGHT);
            })
        }
        else if (this.owner.side == SIDE.right) {
            this.overlaps.right.forEach(target => {
                target.attackSystem.takePhysicalDamage(attack.damage, Phaser.LEFT);
            })
        }
        this.owner.setAnim("attack1", true);

        this.attacking = true;
        this.owner.canMove = false;
        setTimeout(() => {
            this.attacking = false;
            this.owner.canMove = true;            
        }, attack.duration);
    }

    resetOverlaps() {
        this.overlaps.down = [];
        this.overlaps.up = [];
        this.overlaps.left = [];
        this.overlaps.right = [];
    }

    takePhysicalDamage(damage, fromDirection) {
        this.life -= damage;
        this.owner.eventEmitter.emit("onLifeChange", this.life)
        if (this.life <= 0) {
            this.owner.die();
        }
    }

    resetLife() {
        this.life = this.maxLife;
    }
}

