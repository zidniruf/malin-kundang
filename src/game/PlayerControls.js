import { EventBus } from './EventBus'

export default class PlayerControls {
  constructor(scene) {
    this.keyboard = scene.input.keyboard
    this.keys = this.keyboard.addKeys({
      left: 'LEFT', right: 'RIGHT', a: 'A', d: 'D', jump: 'SPACE', up: 'UP',
    })
    this.touch = { left: false, right: false, jump: false }
    this.jumpHeld = false
    this.onControl = ({ action, pressed }) => {
      if (Object.hasOwn(this.touch, action)) this.touch[action] = pressed
    }
    this.reset = () => {
      this.keyboard.resetKeys()
      this.touch = { left: false, right: false, jump: false }
      this.jumpHeld = false
    }
    EventBus.on('control', this.onControl)
    EventBus.on('release-controls', this.reset)
    window.addEventListener('blur', this.reset)
    this.onVisibilityChange = () => {
      if (document.hidden) this.reset()
    }
    document.addEventListener('visibilitychange', this.onVisibilityChange)
  }

  read() {
    const left = this.keys.left.isDown || this.keys.a.isDown || this.touch.left
    const right = this.keys.right.isDown || this.keys.d.isDown || this.touch.right
    const jump = this.keys.jump.isDown || this.keys.up.isDown || this.touch.jump
    const jumpPressed = jump && !this.jumpHeld
    this.jumpHeld = jump
    return { direction: Number(right) - Number(left), jumpPressed }
  }

  destroy() {
    EventBus.off('control', this.onControl)
    EventBus.off('release-controls', this.reset)
    window.removeEventListener('blur', this.reset)
    document.removeEventListener('visibilitychange', this.onVisibilityChange)
    this.reset()
  }
}
