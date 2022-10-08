import Experience from "./Experience.js";
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class Camera {
  constructor() {
    this.experience = new Experience()
    this.sizes = this.experience.sizes
    this.scene = this.experience.scene
    this.canvas = this.experience.canvas

    this.createPerspectiveCamera()
    this.createOrthographicCamera()
    this.setOrbitControls()
  }

  createPerspectiveCamera() {
    this.perspectiveCamera = new THREE.PerspectiveCamera(
      35,
      this.scene.aspect,
      0.1,
      100
    )
    this.scene.add(this.perspectiveCamera)
    this.perspectiveCamera.position.set(29, 14, 12)
  }

  createOrthographicCamera() {
    this.orthographicCamera = new THREE.OrthographicCamera(
      (-this.sizes.aspect * this.sizes.frustum) / 2,
      (this.sizes.aspect * this.sizes.frustum) / 2,
      this.sizes.frustum / 2,
      -this.sizes.frustum / 2,
      -50,
      50
    )
    this.orthographicCamera.position.y = 2.85
    this.orthographicCamera.position.z = 5
    this.orthographicCamera.rotation.x = -Math.PI / 6

    // this.orthographicCamera = new THREE.PerspectiveCamera(
    //   35,
    //   this.scene.aspect,
    //   0.1,
    //   100
    // )
    this.scene.add(this.orthographicCamera)

    // this.cameraHelper = new THREE.CameraHelper(this.orthographicCamera)
    // this.scene.add(this.cameraHelper)

    // const size = 20;
    // const divisions = 20;

    // const gridHelper = new THREE.GridHelper(size, divisions);
    // this.scene.add(gridHelper)

    // const axesHelper = new THREE.AxesHelper(5)
    // this.scene.add(axesHelper)
  }

  setOrbitControls() {
    this.controls = new OrbitControls(this.perspectiveCamera, this.canvas)
    // 阻尼
    this.controls.enableDamping = true
    // 缩放
    this.controls.enableZoom = false
  }

  resize() {
    // Updating perspective camera on resize
    this.perspectiveCamera.aspect = this.sizes.aspect
    this.perspectiveCamera.updateProjectionMatrix()

    // Updating orthongraphic camera on resize
    this.orthographicCamera.left = (-this.sizes.aspect * this.sizes.frustum) / 2
    this.orthographicCamera.right = (this.sizes.aspect * this.sizes.frustum) / 2
    this.orthographicCamera.top = this.sizes.frustum / 2
    this.orthographicCamera.bottom = -this.sizes.frustum / 2
    this.orthographicCamera.updateProjectionMatrix()
  }

  update() {
    this.controls.update()

    // this.cameraHelper.matrixWorldNeedsUpdate = true
    // this.cameraHelper.update()
    // this.cameraHelper.position.copy(this.orthographicCamera.position)
    // this.cameraHelper.rotation.copy(this.orthographicCamera.rotation)
  }
}