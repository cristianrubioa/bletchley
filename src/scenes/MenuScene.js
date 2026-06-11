import Phaser from 'phaser'
import { initAudio } from '../logic/audio.js'

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene')
  }

  create() {
    const cx = 400
    const cy = 300

    // Title
    this.add.text(cx, cy - 80, 'ENIGMA', {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '80px',
      fontStyle: 'bold',
      color: '#4a9eff',
    }).setOrigin(0.5)

    // Subtitle
    this.add.text(cx, cy, 'Bletchley Park, 1941', {
      fontFamily: 'Inter, sans-serif',
      fontSize: '18px',
      color: '#e8e8e8',
      alpha: 0.6,
    }).setOrigin(0.5)

    this.add.text(cx, cy + 30, 'A tribute to Alan Turing', {
      fontFamily: 'Inter, sans-serif',
      fontSize: '14px',
      color: '#4a9eff',
      alpha: 0.5,
    }).setOrigin(0.5)

    // Start button
    const btn = this.add.text(cx, cy + 77, '[ START ]', {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '24px',
      color: '#e8e8e8',
    }).setOrigin(0.5).setInteractive()

    btn.on('pointerover', () => btn.setColor('#4a9eff'))
    btn.on('pointerout', () => btn.setColor('#e8e8e8'))
    btn.on('pointerdown', () => this._start())

    // Pulse animation on title
    this.tweens.add({
      targets: this.children.list[0],
      alpha: { from: 1, to: 0.75 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })

    // Decorative line
    const g = this.add.graphics()
    g.lineStyle(1, 0x4a9eff, 0.2)
    g.lineBetween(cx - 120, cy + 55, cx + 120, cy + 55)
    g.lineBetween(cx - 120, cy + 100, cx + 120, cy + 100)
  }

  _start() {
    initAudio()
    this.registry.set('levelIndex', 0)
    this.scene.start('BriefingScene')
  }
}
