import Phaser from 'phaser'

const RADIUS = 60
const TICK_COUNT = 26

export default class Rotor extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y)

    this.offset = 0
    this._animating = false
    this._locked = false

    this._buildDial()
    this.setSize(RADIUS * 2, RADIUS * 2)
    this.setInteractive(
      new Phaser.Geom.Circle(0, 0, RADIUS),
      Phaser.Geom.Circle.Contains,
    )
    this.on('pointerover', () => scene.input.setDefaultCursor('pointer'))
    this.on('pointerout', () => scene.input.setDefaultCursor('default'))

    // Click zones centered on each arrow triangle (world coords, no container transform issues)
    const ARROW_Y = 35
    const HIT_R = 18
    this._clickHandler = (ptr) => {
      if (this._locked) return
      const dx = ptr.worldX - this.x
      const dy = ptr.worldY - this.y
      const upDy = dy + ARROW_Y    // distance from up-arrow center (0, -ARROW_Y)
      const downDy = dy - ARROW_Y  // distance from down-arrow center (0, +ARROW_Y)
      if (dx * dx + upDy * upDy <= HIT_R * HIT_R) this.increment()
      else if (dx * dx + downDy * downDy <= HIT_R * HIT_R) this.decrement()
    }
    scene.input.on('pointerdown', this._clickHandler)
    this.once('destroy', () => scene.input.off('pointerdown', this._clickHandler))

    scene.add.existing(this)
  }

  _buildDial() {
    const g = this.scene.add.graphics()

    // Background fill
    g.fillStyle(0x12121a, 1)
    g.fillCircle(0, 0, RADIUS)

    // Outer ring
    g.lineStyle(2, 0x4a9eff, 0.8)
    g.strokeCircle(0, 0, RADIUS)

    // Tick marks
    for (let i = 0; i < TICK_COUNT; i++) {
      const angle = (i / TICK_COUNT) * Math.PI * 2 - Math.PI / 2
      const inner = RADIUS - 10
      const outer = RADIUS - 3
      g.lineStyle(1, 0x4a9eff, i % 2 === 0 ? 0.6 : 0.25)
      g.beginPath()
      g.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner)
      g.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer)
      g.strokePath()
    }

    // Up/down click indicators — positioned at ±35 (safe hit-test zone, clear of letter)
    g.fillStyle(0x4a9eff, 0.5)
    g.fillTriangle(0, -40, -6, -30, 6, -30)
    g.fillTriangle(0, 40, -6, 30, 6, 30)

    // Center dot
    g.fillStyle(0x4a9eff, 0.3)
    g.fillCircle(0, 0, 4)

    this.add(g)

    // Active letter
    this._letterText = this.scene.add.text(0, 0, 'A', {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '30px',
      fontStyle: 'bold',
      color: '#e8e8e8',
    }).setOrigin(0.5)

    this.add(this._letterText)
  }

  get letter() {
    return String.fromCharCode(65 + this.offset)
  }

  lock() {
    this._locked = true
  }

  increment() {
    if (this._animating || this._locked) return
    this.offset = (this.offset + 1) % 26
    this._animateTick(-1)
    this.emit('change', this.offset)
  }

  decrement() {
    if (this._animating || this._locked) return
    this.offset = (this.offset + 25) % 26
    this._animateTick(1)
    this.emit('change', this.offset)
  }

  _animateTick(direction) {
    this._animating = true
    const startY = this._letterText.y
    const travel = direction * 14

    this.scene.tweens.add({
      targets: this._letterText,
      y: startY + travel,
      alpha: 0,
      duration: 75,
      ease: 'Power1',
      onComplete: () => {
        this._letterText.setText(this.letter)
        this._letterText.y = startY - travel
        this.scene.tweens.add({
          targets: this._letterText,
          y: startY,
          alpha: 1,
          duration: 75,
          ease: 'Power1',
          onComplete: () => { this._animating = false },
        })
      },
    })
  }

  setOffset(value) {
    this.offset = ((value % 26) + 26) % 26
    this._letterText.setText(this.letter)
  }
}
