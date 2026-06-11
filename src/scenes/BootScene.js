import Phaser from 'phaser'

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene')
  }

  create() {
    document.fonts.ready.then(() => this.scene.start('MenuScene'))
  }
}
