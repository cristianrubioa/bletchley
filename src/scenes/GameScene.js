import Phaser from 'phaser'
import { getLevelConfig } from '../logic/levels.js'
import { decryptMessage, caesarDecryptSegmented } from '../logic/enigma.js'
import { findCribRanges, findCribRangesPerLetter } from '../logic/hints.js'
import { startStaticLoop, stopStaticLoop, playRotorClick, playSuccess, playTimeout } from '../logic/audio.js'
import Rotor from '../ui/Rotor.js'
import LockedRotor from '../ui/LockedRotor.js'
import Timer from '../ui/Timer.js'
import MessageDisplay from '../ui/MessageDisplay.js'
import HintPanel, { expandedHeight } from '../ui/HintPanel.js'

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene')
  }

  create() {
    this._done = false
    const levelIndex = this.registry.get('levelIndex') || 0
    const level = getLevelConfig(levelIndex)
    this._level = level
    this._offsets = new Array(level.rotorCount).fill(0)
    level.lockedRotors?.forEach((i) => { this._offsets[i] = level.solutionOffsets[i] })

    startStaticLoop()

    const cx = 400

    // Level label
    this.add.text(20, 20, `LEVEL ${levelIndex + 1}  ·  ${level.rotorCount} ROTORS`, {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '11px',
      color: '#4a9eff',
      alpha: 0.55,
      letterSpacing: 2,
    })

    // Timer — top-right
    this._timer = new Timer(this, 780, 20, level.duration)
    this._timer.on('timer-expired', () => this._onTimeout())

    // Message display — upper area
    this._display = new MessageDisplay(this, cx, 165, level.ciphertext)

    // Separator line
    const g = this.add.graphics()
    g.lineStyle(1, 0x4a9eff, 0.1)
    g.lineBetween(60, 248, 740, 248)

    // Rotors — centered row
    this._rotors = []
    const spacing = level.rotorCount <= 3 ? 165 : 138
    const totalW = (level.rotorCount - 1) * spacing
    const rotorStartX = cx - totalW / 2

    for (let i = 0; i < level.rotorCount; i++) {
      const rx = rotorStartX + i * spacing
      const isLocked = level.lockedRotors?.includes(i)

      if (isLocked) {
        this._rotors.push(new LockedRotor(this, rx, 380, this._offsets[i]))
      } else {
        const rotor = new Rotor(this, rx, 380)
        const idx = i
        rotor.on('change', (offset) => {
          this._offsets[idx] = offset
          playRotorClick()
          this._updateDisplay()
        })
        this._rotors.push(rotor)
      }

      this.add.text(rx, 453, `R${i + 1}`, {
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: '10px',
        color: '#4a9eff',
        alpha: 0.35,
      }).setOrigin(0.5)
    }

    // Hint panel — bottom-left
    this._hintPanel = null
    if (level.cribs.length > 0) {
      const alwaysRevealed = level.alwaysRevealed ?? false
      const panelH = expandedHeight(level.cribs.length)
      this._hintPanel = new HintPanel(this, 20, 595 - panelH, level.cribs, alwaysRevealed)
      this._hintPanel.on('hint-revealed', () => this._updateDisplay())
    }


    this._updateDisplay()
    this._timer.start()
  }

  update(_t, delta) {
    if (!this._done) this._timer.tick(delta)
  }

  _updateDisplay() {
    if (this._done) return
    const { cipherType, rotors, ciphertext, plaintext } = this._level
    const decrypted = cipherType === 'caesar'
      ? caesarDecryptSegmented(ciphertext, this._level.segments, this._offsets)
      : decryptMessage(ciphertext, rotors, this._offsets)
    const revealedCribs = this._hintPanel ? this._hintPanel.revealedCribs : []
    const ranges = cipherType === 'caesar'
      ? findCribRangesPerLetter(decrypted, plaintext, revealedCribs)
      : findCribRanges(decrypted, revealedCribs)
    this._display.updateDecrypted(decrypted, ranges)
    if (decrypted === plaintext) this._onSuccess()
  }

  _onSuccess() {
    this._done = true
    this._timer.pause()
    stopStaticLoop()
    playSuccess()
    this._rotors.forEach((r) => r.lock?.())

    // Dim the scene
    const dim = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.5)

    const decoded = this.add.text(400, 285, 'DECODED', {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '52px',
      fontStyle: 'bold',
      color: '#51cf66',
    }).setOrigin(0.5).setAlpha(0)

    this.tweens.add({
      targets: [dim, decoded],
      alpha: { from: 0, to: 1 },
      duration: 500,
      ease: 'Power2',
      onComplete: () => {
        this.time.delayedCall(1300, () => this.scene.start('NarrativeScene'))
      },
    })
  }

  _onTimeout() {
    if (this._done) return
    this._done = true
    stopStaticLoop()
    playTimeout()

    const overlay = this.add.rectangle(400, 300, 800, 600, 0xff6b6b, 0)
    this.tweens.add({
      targets: overlay,
      fillAlpha: 0.2,
      duration: 180,
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        this.time.delayedCall(500, () => this.scene.restart())
      },
    })
  }

  shutdown() {
    stopStaticLoop()
  }
}
