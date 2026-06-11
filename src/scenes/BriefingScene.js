import Phaser from 'phaser'
import { getLevelConfig } from '../logic/levels.js'

export default class BriefingScene extends Phaser.Scene {
  constructor() {
    super('BriefingScene')
    this._ready = false
  }

  create() {
    this._ready = false
    const levelIndex = this.registry.get('levelIndex') || 0
    const level = getLevelConfig(levelIndex)
    const cx = 400

    // Level indicator
    this.add.text(cx, 60, `LEVEL ${levelIndex + 1} / 4`, {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '12px',
      color: '#4a9eff',
      alpha: 0.6,
      letterSpacing: 4,
    }).setOrigin(0.5)

    // Separator
    const g = this.add.graphics()
    g.lineStyle(1, 0x4a9eff, 0.2)
    g.lineBetween(100, 80, 700, 80)

    // Briefing lines
    const lines = level.briefingText
    const lineHeight = 44
    const startY = 300 - ((lines.length - 1) * lineHeight) / 2

    lines.forEach((line, i) => {
      const t = this.add.text(cx, startY + i * lineHeight, line, {
        fontFamily: 'Inter, sans-serif',
        fontSize: '18px',
        color: '#e8e8e8',
        align: 'center',
        wordWrap: { width: 580 },
      }).setOrigin(0.5).setAlpha(0)

      this.tweens.add({
        targets: t,
        alpha: 1,
        duration: 400,
        delay: 300 + i * 250,
        ease: 'Power2',
      })
    })

    // Continue prompt
    const prompt = this.add.text(cx, 540, 'press any key to begin', {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '12px',
      color: '#e8e8e8',
      alpha: 0,
    }).setOrigin(0.5)

    this.tweens.add({
      targets: prompt,
      alpha: 0.4,
      duration: 600,
      delay: 300 + lines.length * 250 + 300,
      ease: 'Power2',
      onComplete: () => { this._ready = true },
    })

    this.input.keyboard.on('keydown', () => this._proceed())
    this.input.on('pointerdown', () => this._proceed())
  }

  _proceed() {
    if (!this._ready) return
    this.input.keyboard.removeAllListeners()
    this.input.removeAllListeners()
    this.scene.start('GameScene')
  }
}
