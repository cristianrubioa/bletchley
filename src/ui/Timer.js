import Phaser from 'phaser'

export default class Timer extends Phaser.GameObjects.Text {
  constructor(scene, x, y, duration) {
    super(scene, x, y, '', {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '22px',
      color: '#e8e8e8',
    })

    this.totalDuration = duration
    this.remaining = duration
    this._running = false

    this.setOrigin(1, 0)
    this._render()
    scene.add.existing(this)
  }

  start() {
    this._running = true
  }

  pause() {
    this._running = false
  }

  tick(delta) {
    if (!this._running) return
    this.remaining -= delta / 1000
    if (this.remaining <= 0) {
      this.remaining = 0
      this._running = false
      this._render()
      this.emit('timer-expired')
      return
    }
    this._render()
    const pct = this.remaining / this.totalDuration
    this.setColor(pct < 0.2 ? '#ff6b6b' : '#e8e8e8')
  }

  _render() {
    const secs = Math.ceil(this.remaining)
    const m = String(Math.floor(secs / 60)).padStart(2, '0')
    const s = String(secs % 60).padStart(2, '0')
    this.setText(`${m}:${s}`)
  }
}
