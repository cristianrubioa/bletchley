import Phaser from 'phaser'

const RADIUS = 60

export default class LockedRotor extends Phaser.GameObjects.Container {
  constructor(scene, x, y, offset) {
    super(scene, x, y)

    const letter = String.fromCharCode(65 + ((offset % 26) + 26) % 26)

    const g = scene.add.graphics()
    g.fillStyle(0x1c1c2a, 1)
    g.fillCircle(0, 0, RADIUS)
    g.lineStyle(1, 0x4a9eff, 0.2)
    g.strokeCircle(0, 0, RADIUS)

    const letterText = scene.add.text(0, -8, letter, {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '30px',
      fontStyle: 'bold',
      color: '#e8e8e8',
      alpha: 0.35,
    }).setOrigin(0.5)

    const lockedLabel = scene.add.text(0, 18, 'LOCKED', {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '9px',
      color: '#ff6b6b',
      alpha: 0.5,
      letterSpacing: 2,
    }).setOrigin(0.5)

    this.add([g, letterText, lockedLabel])
    this.setSize(RADIUS * 2, RADIUS * 2)
    scene.add.existing(this)
  }
}
