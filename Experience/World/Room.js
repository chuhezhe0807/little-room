import * as THREE from 'three'
import Experience from '../Experience'
import GSAP from 'gsap'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'
import GUI from 'lil-gui'

export default class Room {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.time = this.experience.time
    this.camera = this.experience.camera

    this.resources = this.experience.resources
    this.room = this.resources.items.room
    this.actualRoom = this.room.scene
    this.roomChildren = {}

    this.lerp = {
      current: 0,
      target: 0,
      ease: 0.1
    }

    // this.gui = new GUI({ container: document.querySelector('.third-section') })
    this.obj = {
      width: 0.7,
      height: 1.08,
      x: 3.45,
      y: 4.22,
      z: -0.4,
      position: {
        x: -4.1,
        y: -5,
        z: -1.28
      }
    }

    this.setRoom()
    this.setAnimations()
    this.onMouseMove()

    // this.serGUI()
  }

  setRoom() {
    this.actualRoom.children.forEach((child) => {
      // console.log(child);
      child.castShadow = true
      child.receiveShadow = true

      if (child instanceof THREE.Group) {
        child.children.forEach((groupChild) => {
          groupChild.castShadow = true
          groupChild.receiveShadow = true
        })
      }

      if (child.name === 'Aquarium') {
        // console.log(child);
        child.children[0].material = new THREE.MeshPhysicalMaterial()
        child.children[0].material.roughness = 0
        child.children[0].material.color.set(0x279fdd)
        // 为非金属材质所设置的折射率，范围由1.0到2.333。默认为1.5
        child.children[0].material.ior = 3
        // 透光率（或者说透光性），范围从0.0到1.0。默认值是0.0。
        child.children[0].material.transmission = 1
        child.children[0].material.opacity = 1
      }
      // if (child.name === 'AquaGlass') {
      //   child.material = new THREE.MeshPhysicalMaterial()
      //   child.material.roughness = 0
      //   child.material.color.set(0x279fdd)
      //   // 为非金属材质所设置的折射率，范围由1.0到2.333。默认为1.5
      //   child.material.ior = 3
      //   // 透光率（或者说透光性），范围从0.0到1.0。默认值是0.0。
      //   child.material.transmission = 1
      //   child.material.opacity = 1
      // }

      if (child.name == 'Computer') {
        child.children[1].material = new THREE.MeshBasicMaterial({
          map: this.resources.items.screen,
        })
      }
      // if (child.name == 'Screen') {
      //   child.material = new THREE.MeshBasicMaterial({
      //     map: this.resources.items.screen,
      //   })
      // }

      if (child.name == "MiniFloor") {
        child.position.x = -0.608078
        child.position.z = 3.639887
      }

      // if (['MailBox', 'Lamp', 'FloorFirst', 'FlootSecond', 'FloorThird', 'Dirt', 'FlowerOne', 'FlowerTwo'].includes(child.name)) {
      //   child.scale.set(0, 0, 0)
      // }

      child.scale.set(0, 0, 0)
      if (child.name == 'Cube') {
        // child.scale.set(1, 1, 1)
        child.position.set(0, 0, 0)
        child.rotation.y = Math.PI / 4
      }

      this.roomChildren[child.name.toLowerCase()] = child
    })

    const width = this.obj.width;
    const height = this.obj.height;
    const intensity = 1;
    this.rectLight = new THREE.RectAreaLight(0xffffff, intensity, width, height);
    this.rectLight.position.set(this.obj.x, this.obj.y, this.obj.z);
    this.rectLight.rotation.x = -Math.PI / 2
    this.rectLight.rotation.z = Math.PI / 4
    this.actualRoom.add(this.rectLight)
    this.roomChildren['rectLight'] = this.rectLight

    // const rectLightHelper = new RectAreaLightHelper(this.rectLight);
    // this.rectLight.add(rectLightHelper);

    this.scene.add(this.actualRoom)
    this.actualRoom.scale.set(0.26, 0.26, 0.26)
  }

  serGUI() {
    this.gui.add(this.obj, 'width', 0, 1, 0.01).onChange(() => { this.rectLight.width = this.obj.width })
    this.gui.add(this.obj, 'height', 1, 2, 0.01).onChange(() => { this.rectLight.height = this.obj.height })
    this.gui.add(this.obj, 'x', 0, 10, 0.001).onChange(() => { this.rectLight.position.x = this.obj.x })
    this.gui.add(this.obj, 'y', 0, 10, 0.001).onChange(() => { this.rectLight.position.y = this.obj.y; console.log(this.rectLight.position); })
    this.gui.add(this.obj, 'z', -50, 50, 0.001).onChange(() => { this.rectLight.position.z = this.obj.z; console.log(this.rectLight.position); })

    this.gui.add(this.obj.position, 'x', -5, 5, 0.01).onChange(() => {
      this.camera.orthographicCamera.position.x = this.obj.position.x
    })
    this.gui.add(this.obj.position, 'y', -5, 5, 0.01).onChange(() => {
      this.camera.orthographicCamera.position.y = this.obj.position.y
    })
    this.gui.add(this.obj.position, 'z', -5, 5, 0.01).onChange(() => {
      this.camera.orthographicCamera.position.z = this.obj.position.z
    })
  }

  setAnimations() {
    this.mixer = new THREE.AnimationMixer(this.actualRoom)
    // console.log(this.room.animations);
    // 导出模型换了之后，动画名称也变了
    // this.swim = this.mixer.clipAction(this.room.animations.find(item => item.name == 'FishAction.001'))
    this.swim = this.mixer.clipAction(this.room.animations.find(item => item.name == 'FishAction.001'))
    this.swim.play()
  }

  onMouseMove() {
    window.addEventListener('mousemove', (e) => {
      this.rotation = ((e.clientX - window.innerWidth / 2) * 2) / window.innerWidth
      this.lerp.target = this.rotation * 0.1
    })
  }

  resize() {

  }

  update() {
    this.lerp.current = GSAP.utils.interpolate(
      this.lerp.current,
      this.lerp.target,
      this.lerp.ease,
    )
    this.actualRoom.rotation.y = this.lerp.current

    this.mixer.update(this.time.delta * 0.001)
  }
}