import * as THREE from 'three'
import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import World from './World/World.js'
import Resources from './Utils/Resources.js'
import assest from './Utils/assest.js'
import Theme from './Theme.js'
import Preloader from './Preloader.js'
import Controls from './World/Controls.js'


export default class Experience {
  static instance
  constructor(canvas) {
    if (Experience.instance) {
      return Experience.instance
    }

    Experience.instance = this
    this.canvas = canvas
    this.sizes = new Sizes()
    this.scene = new THREE.Scene()
    this.time = new Time()
    this.camera = new Camera()
    this.renderer = new Renderer()
    this.resources = new Resources(assest)
    this.theme = new Theme()
    this.world = new World()
    this.preloader = new Preloader()

    this.preloader.on('enableControls', () => {
      console.log('enableControls');
      this.controls = new Controls()
    })

    // 可能是有什么东西没做对？ 刚开始加载的时候尺寸不对 resize之后就对了
    this.resize()
    this.sizes.on('resize', () => {
      this.resize()
    })

    this.time.on('update', () => {
      this.update()
    })
  }

  resize() {
    this.camera.resize()
    this.world.resize()
    this.renderer.resize()
  }

  update() {
    this.preloader.update()
    this.camera.update()
    this.world.update()
    this.renderer.update()
  }
}