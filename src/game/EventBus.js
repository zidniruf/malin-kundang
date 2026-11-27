import Phaser from 'phaser'

// UI sends control commands; the active scene reports loading and errors.
export const EventBus = new Phaser.Events.EventEmitter()
