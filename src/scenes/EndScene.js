import Phaser from 'phaser'

const FRAGMENTS = [
  {
    year: '1952',
    text: 'Alan Turing is arrested for "gross indecency" — the same charge used to imprison Oscar Wilde fifty years earlier. His crime: loving another man. He is chemically castrated as an alternative to prison.',
  },
  {
    year: '1954',
    text: 'On June 7, Alan Turing is found dead at forty-one years old. A half-eaten apple lies beside him. The inquest rules suicide. He had saved the world. The world had broken him.',
  },
]

const FINAL_LINE = 'El hombre que salvó al mundo\nnunca pudo ser él mismo en él.'

const PARDON =
  'In 2013, Queen Elizabeth II granted Turing a posthumous Royal Pardon.\nIn 2017, the Turing Law extended pardons to thousands convicted under the same statute.\n\nToo late for Alan. Not too late to remember.'

export default class EndScene extends Phaser.Scene {
  constructor() {
    super('EndScene')
  }

  create() {
    const cx = 400
    let delay = 300

    FRAGMENTS.forEach(({ year, text }, i) => {
      const y = this.add.text(cx, 68 + i * 130, year, {
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: '28px',
        fontStyle: 'bold',
        color: '#4a9eff',
        alpha: 0.7,
      }).setOrigin(0.5).setAlpha(0)

      const t = this.add.text(cx, 92 + i * 130, text, {
        fontFamily: 'Inter, sans-serif',
        fontSize: '14px',
        color: '#e8e8e8',
        align: 'center',
        lineSpacing: 6,
        wordWrap: { width: 560 },
        alpha: 0.85,
      }).setOrigin(0.5, 0).setAlpha(0)

      this.tweens.add({ targets: y, alpha: 0.7, duration: 500, delay, ease: 'Power2' })
      this.tweens.add({ targets: t, alpha: 0.85, duration: 500, delay: delay + 150, ease: 'Power2' })
      delay += 900
    })

    // Separator
    const g = this.add.graphics()
    g.lineStyle(1, 0x4a9eff, 0.3)
    g.lineBetween(cx - 100, 298, cx + 100, 298)
    g.setAlpha(0)
    this.tweens.add({ targets: g, alpha: 1, duration: 400, delay, ease: 'Power2' })
    delay += 400

    // Final line
    const finalText = this.add.text(cx, 340, FINAL_LINE, {
      fontFamily: 'Inter, sans-serif',
      fontSize: '20px',
      fontStyle: 'italic',
      color: '#e8e8e8',
      align: 'center',
      lineSpacing: 8,
      wordWrap: { width: 580 },
    }).setOrigin(0.5).setAlpha(0)
    this.tweens.add({ targets: finalText, alpha: 1, duration: 700, delay, ease: 'Power2' })
    delay += 1000

    // Pardon note
    const pardon = this.add.text(cx, 430, PARDON, {
      fontFamily: 'Inter, sans-serif',
      fontSize: '13px',
      color: '#e8e8e8',
      align: 'center',
      lineSpacing: 6,
      wordWrap: { width: 540 },
      alpha: 0.55,
    }).setOrigin(0.5).setAlpha(0)
    this.tweens.add({ targets: pardon, alpha: 0.55, duration: 600, delay, ease: 'Power2' })
    delay += 800

    // Play again
    const btn = this.add.text(cx, 545, '[ PLAY AGAIN ]', {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '16px',
      color: '#4a9eff',
      alpha: 0,
    }).setOrigin(0.5)

    this.tweens.add({
      targets: btn,
      alpha: 1,
      duration: 400,
      delay,
      ease: 'Power2',
      onComplete: () => {
        btn.setInteractive()
        btn.on('pointerover', () => btn.setColor('#e8e8e8'))
        btn.on('pointerout', () => btn.setColor('#4a9eff'))
        btn.on('pointerdown', () => {
          this.registry.set('levelIndex', 0)
          this.scene.start('MenuScene')
        })
      },
    })
  }
}
