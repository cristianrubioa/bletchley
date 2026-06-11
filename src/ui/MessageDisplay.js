import Phaser from 'phaser'

const CIPHER_STYLE = {
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: '22px',
  color: '#4a9eff',
  align: 'center',
  wordWrap: { width: 740 },
}

const DECRYPT_STYLE = {
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: '22px',
  color: '#e8e8e8',
  align: 'center',
  wordWrap: { width: 740 },
}

export default class MessageDisplay extends Phaser.GameObjects.Container {
  constructor(scene, x, y, ciphertext) {
    super(scene, x, y)

    this._cipherText = scene.add.text(0, -30, ciphertext, CIPHER_STYLE).setOrigin(0.5)
    this._decryptText = scene.add.text(0, 30, '', DECRYPT_STYLE).setOrigin(0.5)
    this._highlightGfx = scene.add.graphics()

    // Label above ciphertext
    this._cipherLabel = scene.add.text(0, -62, 'INTERCEPTED', {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '11px',
      color: '#4a9eff',
      alpha: 0.6,
      letterSpacing: 4,
    }).setOrigin(0.5)

    this._decryptLabel = scene.add.text(0, -2, 'DECRYPTED', {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '11px',
      color: '#e8e8e8',
      alpha: 0.4,
      letterSpacing: 4,
    }).setOrigin(0.5)

    this.add([this._highlightGfx, this._cipherLabel, this._cipherText, this._decryptLabel, this._decryptText])
    scene.add.existing(this)
  }

  updateDecrypted(text, highlightRanges) {
    this._decryptText.setText(text)
    this._highlightGfx.clear()

    if (!highlightRanges || highlightRanges.length === 0) return

    // Estimate char width from font size (JetBrains Mono is ~0.6× em)
    const charW = 13.2
    const totalW = text.length * charW
    const startX = -totalW / 2

    this._highlightGfx.fillStyle(0x51cf66, 0.15)
    this._highlightGfx.lineStyle(1, 0x51cf66, 0.5)

    for (const { start, end } of highlightRanges) {
      const rx = startX + start * charW
      const rw = (end - start) * charW
      this._highlightGfx.fillRect(rx, 14, rw, 28)
      this._highlightGfx.strokeRect(rx, 14, rw, 28)
    }
  }
}
