import Phaser from 'phaser'
import { getLevelConfig, LEVEL_COUNT } from '../logic/levels.js'

export default class NarrativeScene extends Phaser.Scene {
  constructor() {
    super('NarrativeScene')
    this._ready = false
  }

  create() {
    this._ready = false
    const levelIndex = this.registry.get('levelIndex') || 0
    const level = getLevelConfig(levelIndex)

    // No narrative content — short pause then advance
    if (!level.narrativeYear && !level.narrativeText) {
      this.time.delayedCall(600, () => this._proceed(levelIndex))
      return
    }

    const cx = 400
    const elements = []

    if (level.narrativeYear) {
      const year = this.add.text(cx, 110, level.narrativeYear, {
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: '60px',
        fontStyle: 'bold',
        color: '#4a9eff',
      }).setOrigin(0.5).setAlpha(0)
      elements.push({ obj: year, delay: 200 })
    }

    if (level.narrativeText) {
      const body = this.add.text(cx, 310, level.narrativeText, {
        fontFamily: 'Inter, sans-serif',
        fontSize: '17px',
        color: '#e8e8e8',
        align: 'center',
        lineSpacing: 10,
        wordWrap: { width: 580 },
      }).setOrigin(0.5).setAlpha(0)
      elements.push({ obj: body, delay: 600 })
    }

    // Decorative line under year
    const g = this.add.graphics()
    g.lineStyle(1, 0x4a9eff, 0.2)
    g.lineBetween(cx - 80, 165, cx + 80, 165)
    g.setAlpha(0)
    elements.push({ obj: g, delay: 400 })

    elements.forEach(({ obj, delay }) => {
      this.tweens.add({ targets: obj, alpha: 1, duration: 500, delay, ease: 'Power2' })
    })

    const prompt = this.add.text(cx, 545, 'press any key to continue', {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '11px',
      color: '#e8e8e8',
      alpha: 0,
    }).setOrigin(0.5)

    this.tweens.add({
      targets: prompt,
      alpha: 0.38,
      duration: 400,
      delay: 1600,
      ease: 'Power2',
      onComplete: () => { this._ready = true },
    })

    this.input.keyboard.on('keydown', () => this._proceed(levelIndex))
    this.input.on('pointerdown', () => this._proceed(levelIndex))
  }

  _proceed(levelIndex) {
    if (!this._ready) return
    this.input.keyboard.removeAllListeners()
    this.input.removeAllListeners()
    const next = levelIndex + 1
    if (next >= LEVEL_COUNT) {
      this.scene.start('EndScene')
    } else {
      this.registry.set('levelIndex', next)
      this.scene.start('BriefingScene')
    }
  }
}
