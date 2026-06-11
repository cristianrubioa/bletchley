import Phaser from 'phaser'

const PANEL_W = 220
const SLOT_H = 52
const PADDING = 12
const HEADER_H = 36

const STYLE_LABEL = {
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: '11px',
  color: '#4a9eff',
  letterSpacing: 3,
}
const STYLE_HINT = {
  fontFamily: 'Inter, sans-serif',
  fontSize: '13px',
  color: '#e8e8e8',
  wordWrap: { width: PANEL_W - PADDING * 2 },
}
const STYLE_REVEALED = {
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: '14px',
  fontStyle: 'bold',
  color: '#51cf66',
}

export function expandedHeight(cribCount) {
  return HEADER_H + cribCount * SLOT_H + PADDING
}

export default class HintPanel extends Phaser.GameObjects.Container {
  constructor(scene, x, y, cribs, alwaysRevealed = false) {
    super(scene, x, y)

    this._cribs = cribs
    this._alwaysRevealed = alwaysRevealed
    this._revealed = new Array(cribs.length).fill(alwaysRevealed)
    this._expanded = alwaysRevealed

    this._bg = scene.add.graphics()
    this._slots = []
    this._slotTexts = []

    this._buildPanel()
    scene.add.existing(this)
  }

  get revealedCribs() {
    return this._cribs
      .filter((_, i) => this._revealed[i])
      .map((c) => c.word)
  }

  _buildPanel() {
    this._drawBg()
    this._buildHeader()
    this._buildSlots()
    if (!this._alwaysRevealed) this._collapse()
  }

  _drawBg() {
    this._bg.clear()
    const h = this._expanded
      ? HEADER_H + this._cribs.length * SLOT_H + PADDING
      : HEADER_H
    this._bg.fillStyle(0x12121a, 0.92)
    this._bg.fillRoundedRect(0, 0, PANEL_W, h, 6)
    this._bg.lineStyle(1, 0x4a9eff, 0.3)
    this._bg.strokeRoundedRect(0, 0, PANEL_W, h, 6)
  }

  _buildHeader() {
    if (this._alwaysRevealed) {
      this._headerLabel = this.scene.add.text(PADDING, HEADER_H / 2, 'FIND', STYLE_LABEL)
        .setOrigin(0, 0.5)
      this.add([this._bg, this._headerLabel])
      return
    }

    const headerZone = this.scene.add.zone(0, 0, PANEL_W, HEADER_H)
      .setOrigin(0)
      .setInteractive()
    headerZone.on('pointerdown', () => this._toggle())
    headerZone.on('pointerover', () => this.scene.input.setDefaultCursor('pointer'))
    headerZone.on('pointerout', () => this.scene.input.setDefaultCursor('default'))

    this._headerLabel = this.scene.add.text(PADDING, HEADER_H / 2, 'HINTS', STYLE_LABEL)
      .setOrigin(0, 0.5)

    this._chevron = this.scene.add.text(PANEL_W - PADDING, HEADER_H / 2, '▾', {
      ...STYLE_LABEL, color: '#4a9eff',
    }).setOrigin(1, 0.5)

    this.add([this._bg, headerZone, this._headerLabel, this._chevron])
  }

  _buildSlots() {
    this._cribs.forEach((crib, i) => {
      const slotY = HEADER_H + i * SLOT_H

      if (this._alwaysRevealed) {
        const label = this.scene.add.text(PADDING, slotY + SLOT_H / 2, crib.hint, STYLE_HINT)
          .setOrigin(0, 0.5)
        this._slots.push(null)
        this._slotTexts.push(label)
        this.add(label)
        return
      }

      const zone = this.scene.add.zone(0, slotY, PANEL_W, SLOT_H)
        .setOrigin(0)
        .setInteractive()
      zone.on('pointerdown', () => this._revealHint(i))
      zone.on('pointerover', () => this.scene.input.setDefaultCursor('pointer'))
      zone.on('pointerout', () => this.scene.input.setDefaultCursor('default'))

      const label = this.scene.add.text(
        PADDING,
        slotY + SLOT_H / 2,
        `Hint ${i + 1}`,
        STYLE_HINT,
      ).setOrigin(0, 0.5)

      this._slots.push(zone)
      this._slotTexts.push(label)
      this.add([zone, label])
    })
  }

  _toggle() {
    this._expanded = !this._expanded
    this._expanded ? this._expand() : this._collapse()
  }

  _expand() {
    this._slots.forEach((z) => z.setVisible(true))
    this._slotTexts.forEach((t) => t.setVisible(true))
    this._chevron.setText('▴')
    this._drawBg()
  }

  _collapse() {
    this._slots.forEach((z) => z.setVisible(false))
    this._slotTexts.forEach((t) => t.setVisible(false))
    this._chevron.setText('▾')
    this._drawBg()
  }

  _revealHint(index) {
    if (this._revealed[index]) return
    this._revealed[index] = true
    const crib = this._cribs[index]
    this._slotTexts[index].setText(crib.word).setStyle(STYLE_REVEALED)
    this.emit('hint-revealed')
  }
}
