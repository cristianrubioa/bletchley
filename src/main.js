import Phaser from 'phaser'
import BootScene from './scenes/BootScene.js'
import MenuScene from './scenes/MenuScene.js'
import BriefingScene from './scenes/BriefingScene.js'
import GameScene from './scenes/GameScene.js'
import NarrativeScene from './scenes/NarrativeScene.js'
import EndScene from './scenes/EndScene.js'

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#0a0a0f',
  parent: 'game',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, MenuScene, BriefingScene, GameScene, NarrativeScene, EndScene],
}

new Phaser.Game(config)
