import Experience from "./Experience.js"
import { EventEmitter } from "events"
import GSAP from 'gsap'
import Convert from './Utils/ConvertDivsToSpans.js'

export default class Preloader extends EventEmitter {
  constructor() {
    super()
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.world = this.experience.world
    this.sizes = this.experience.sizes
    this.camera = this.experience.camera
    this.device = this.sizes.device

    this.sizes.on('switchdevice', (device) => {
      this.device = device
    })

    this.world.on('worldReady', () => {
      this.setAssets()
      this.playIntro()
    })
  }

  setAssets() {
    Convert(document.querySelector('.intro-text'))
    Convert(document.querySelector('.second-sub'))
    Convert(document.querySelector('.hero-main-title'))
    Convert(document.querySelector('.hero-section-subheading'))
    Convert(document.querySelector('.hero-main-description'))
    this.room = this.experience.world.room.actualRoom
    this.roomChildren = this.experience.world.room.roomChildren
    // console.log(this.room, this.roomChildren);
  }

  firstIntro() {
    return new Promise((resolve) => {
      this.timeLine = new GSAP.timeline()
      this.timeLine.set('.animatedis', { y: 0, yPercent: 100 })
      this.timeLine.to('.preloader', {
        opacity: 0,
        delay: 1,
        onComplete: () => {
          document.querySelector('.preloader').classList.add('hidden')
        }
      })

      if (this.device == 'desktop') {
        this.timeLine.to(this.roomChildren.cube.scale, {
          x: 0.8,
          y: 0.8,
          z: 0.8,
          ease: 'back.out(2.5)',
          duration: 1
        }).to(this.roomChildren.cube.position, {
          x: -5,
          ease: 'power1.out',
          duration: 1,
          // onComplete: resolve,
        })
      } else {
        this.timeLine.to(this.roomChildren.cube.scale, {
          x: 0.8,
          y: 0.8,
          z: 0.8,
          ease: 'back.out(2.5)',
          duration: 1
        }).to(this.camera.orthographicCamera.position, {
          y: 2.3,
          ease: 'power1.out',
          duration: 1,
        }).to(this.room.scale, {
          x: 0.185,
          y: 0.185,
          z: 0.185,
          duration: 0.7,
          ease: 'back.out(2.5)'
        })
      }

      this.timeLine.to('.intro-text .animatedis', {
        yPercent: 0,
        stagger: 0.05,
        ease: 'back.out(1.7)',
      })
        .to('.arrow-svg-wrapper', {
          opacity: 1,
          ease: 'back.out(1.7)',
        }, 'samearrow')
        .to('.toggle-bar', {
          opacity: 1,
          ease: 'back.out(1.7)',
          onComplete: resolve,
        }, 'samearrow')
    })
  }

  secondIntro() {
    return new Promise((resolve) => {
      // console.log(this.roomChildren);
      this.secondTimeLine = new GSAP.timeline()
      this.secondTimeLine
        .to('.intro-text .animatedis', {
          yPercent: 100,
          stagger: 0.05,
          ease: 'back.in(1.7)',
        }, 'fadeout')
        .to('.arrow-svg-wrapper', {
          opacity: 0,
        }, 'fadeout')
        .to(this.room.position, {
          x: 0,
          y: 0,
          z: 0,
          ease: 'power1.out',
          duration: 0.7
        }, 'same')
        .to(this.roomChildren.cube.rotation, {
          y: 2 * Math.PI + Math.PI / 4,
        }, 'same')
        .to(this.roomChildren.cube.scale, {
          x: 4.2,
          y: 4.2,
          z: 4.2,
        }, 'same')
        .set(this.roomChildren.body.scale, {
          x: 1,
          y: 1,
          z: 1,
        })
        .to(this.camera.orthographicCamera.position, {
          y: 4
        }, 'same')
        .to(this.roomChildren.cube.position, {
          x: 0,
          y: 4.27361,
          z: -0.254385
        }, 'same')
        .to(this.roomChildren.cube.scale, {
          x: 0,
          y: 0,
          z: 0,
          duration: 0.7
        })
        .to(this.roomChildren.desks.scale, {
          x: 1,
          y: 1,
          z: 1,
          ease: 'back.out(2.2)',
          duration: 0.5
        })
        .to(this.roomChildren.tablestuff.scale, {
          x: 1,
          y: 1,
          z: 1,
          ease: 'back.out(2.2)',
          duration: 0.5
        })
        .to(this.roomChildren.computer.scale, {
          x: 1,
          y: 1,
          z: 1,
          ease: 'back.out(2.2)',
          duration: 0.5
        })
        .to(this.roomChildren.shelves.scale, {
          x: 1,
          y: 1,
          z: 1,
          ease: 'back.out(2.2)',
          duration: 0.5
        })
        .to(this.roomChildren.flooritems.scale, {
          x: 1,
          y: 1,
          z: 1,
          ease: 'back.out(2.2)',
          duration: 0.5
        })
        .set(this.roomChildren.minifloor.scale, {
          x: 1,
          y: 1,
          z: 1,
        })
        .to(this.roomChildren.chair.scale, {
          x: 1,
          y: 1,
          z: 1,
          ease: 'back.out(2.2)',
          duration: 0.5
        }, 'chair')
        .to(this.roomChildren.chair.rotation, {
          y: 4 * Math.PI + Math.PI / 4
        }, 'chair')
        .to(this.roomChildren.aquarium.scale, {
          x: 1,
          y: 1,
          z: 1,
          ease: 'back.out(2.2)',
          duration: 0.5
        })
        .to(this.roomChildren.clock.scale, {
          x: 1,
          y: 1,
          z: 1,
          ease: 'back.out(2.2)',
          duration: 0.5,
          onComplete: resolve
        })
        .to('.hero-main-title .animatedis', {
          yPercent: 0,
          stagger: 0.05,
          ease: 'back.out(1.7)',
        }, 'sametext')
        .to('.hero-main-description .animatedis', {
          yPercent: 0,
          stagger: 0.05,
          ease: 'back.out(1.7)',
        }, 'sametext')
        .to('.second-sub .animatedis', {
          yPercent: 0,
          stagger: 0.05,
          ease: 'back.out(1.7)',
        }, 'sametext')
        .to('.first-sub .animatedis', {
          yPercent: 0,
          stagger: 0.05,
          ease: 'back.out(1.7)',
        }, 'sametext')
        .to('.arrow-svg-wrapper', {
          opacity: 1,
        }, 'fadein')
    })
  }

  onScroll(e) {
    if (e.deltaY > 0) {
      this.removeEventLinters()
      this.playSecondIntro()
    }
  }

  onTouch(e) {
    this.initalY = e.touches[0].clientY
  }

  onTouchMove(e) {
    let currentY = e.touches[0].clientY
    let difference = this.initalY - currentY
    if (difference > 0) {
      console.log('swipped up');
      this.removeEventLinters()
      this.playSecondIntro()
    }
    this.initalY = null
  }

  removeEventLinters() {
    window.removeEventListener('wheel', this.scrollOnceEvent)
    window.removeEventListener('touchstart', this.touchStart)
    window.removeEventListener('touchmove', this.touchMove)
  }

  async playIntro() {
    // 防止moon模式还开着灯
    this.roomChildren.rectLight.width = 0
    this.roomChildren.rectLight.height = 0
    await this.firstIntro()
    // this.moveFlag = true
    this.scrollOnceEvent = this.onScroll.bind(this)
    this.touchStart = this.onTouch.bind(this)
    this.touchMove = this.onTouchMove.bind(this)
    window.addEventListener('wheel', this.scrollOnceEvent)
    window.addEventListener('touchstart', this.touchStart)
    window.addEventListener('touchmove', this.touchMove)
  }

  async playSecondIntro() {
    // this.moveFlag = false
    // this.scaleFlag = true
    await this.secondIntro()
    // this.scaleFlag = false
    this.emit('enableControls')
  }

  // move() {
  //   if (this.device == 'desktop') {
  //     this.room.position.set(-1, 0, 0)
  //   } else {
  //     this.room.position.set(0, 0, -1)
  //   }
  // }

  update() {
    // 暂不需要修改 room 位置，在两个动画之间
    // if (this.moveFlag) {
    //   this.move()
    // }

    // if (this.scaleFlag) {
    //   this.rectLight.width = 0
    //   this.rectLight.height = 0
    // }
  }
}