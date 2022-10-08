import * as THREE from 'three'
import Experience from '../Experience.js'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ASScroll from '@ashthornton/asscroll'
import GSAP from 'gsap'

export default class Controls {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.camera = this.experience.camera
    this.time = this.experience.time
    this.room = this.experience.world.room.actualRoom
    this.room.children.forEach((child) => {
      if (child.type === 'RectAreaLight') {
        this.rectLight = child
      }
    })

    this.circleFirst = this.experience.world.floor.circleFirst
    this.circleSecond = this.experience.world.floor.circleSecond
    this.circleThird = this.experience.world.floor.circleThird

    this.sizes = this.experience.sizes
    // 注册插件
    GSAP.registerPlugin(ScrollTrigger)

    // 修改 page overflow 属性为 visible 解决移动端不能滚动的问题
    document.querySelector('.page').style.overflow = 'visible'

    // 滚动 smooth
    this.setSmoothScroll()

    // 模型滚动
    this.setScrollTrigger()

    // this.progress = 0
    // this.dummyCurve = new THREE.Vector3(0, 0, 0)

    // this.lerp = {
    //   current: 0,
    //   target: 0,
    //   ease: 0.1
    // }
    // this.position = new THREE.Vector3(0, 0, 0)
    // this.lookAtPosition = new THREE.Vector3(0, 0, 0)

    // this.directionalVector = new THREE.Vector3(0, 0, 0)
    // this.staticVector = new THREE.Vector3(0, -1, 0)
    // this.crossVector = new THREE.Vector3(0, 0, 0)

    // this.setPath()
    // 监听滚轮事件
    // this.onWheel()
  }

  // gasp proxy ASScroll
  setupASScroll() {
    // https://github.com/ashthornton/asscroll
    const asscroll = new ASScroll({
      // ease: 0.3,
      disableRaf: true
    });

    GSAP.ticker.add(asscroll.update);

    ScrollTrigger.defaults({
      scroller: asscroll.containerElement
    });


    ScrollTrigger.scrollerProxy(asscroll.containerElement, {
      scrollTop(value) {
        if (arguments.length) {
          asscroll.currentPos = value;
          return;
        }
        return asscroll.currentPos;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      },
      fixedMarkers: true
    });


    asscroll.on("update", ScrollTrigger.update);
    ScrollTrigger.addEventListener("refresh", asscroll.resize);

    requestAnimationFrame(() => {
      asscroll.enable({
        newScrollElements: document.querySelectorAll(".gsap-marker-start, .gsap-marker-end, [asscroll]")
      });

    });
    return asscroll;
  }

  setSmoothScroll() {
    this.asscroll = this.setupASScroll()
  }

  setScrollTrigger() {
    ScrollTrigger.matchMedia({
      // Desktop
      "(min-width: 969px)": () => {
        this.room.scale.set(0.26, 0.26, 0.26)
        this.rectLight.width = 0.7
        this.rectLight.height = 1.08
        // First Section
        this.firstMoveTimeLine = new GSAP.timeline({
          scrollTrigger: {
            trigger: '.first-move',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            invalidateOnRefresh: true
          }
        })
        this.firstMoveTimeLine
          .to(this.room.position, {
            x: () => {
              return this.sizes.width * 0.0014;
            },
            z: () => {
              return this.sizes.width * 0.0005;
            }
          })
          .to(this.room.scale, {
            x: 0.3,
            y: 0.3,
            z: 0.3,
          })
          .to(this.camera.orthographicCamera.position, {
            y: 3.8,
          })

        // Second Section
        this.secondMoveTimeLine = new GSAP.timeline({
          scrollTrigger: {
            trigger: '.second-move',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            invalidateOnRefresh: true
          }
        })

        this.secondMoveTimeLine.to(
          this.room.position,
          {
            x: -2.2,
            z: () => {
              return this.sizes.height * 0.0032;
            },
          },
          "same",
        ).to(
          this.rectLight,
          {
            width: 0.7 * 1.5,
            height: 1.08 * 1.5
          },
          "same",
        ).to(
          this.room.scale,
          {
            x: 0.4,
            y: 0.4,
            z: 0.4,
          },
          "same",
        )

        // Third Section
        this.thirdMoveTimeLine = new GSAP.timeline({
          scrollTrigger: {
            trigger: '.third-move',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            invalidateOnRefresh: true
          }
        })
          .to(this.camera.orthographicCamera.position, {
            x: -6.8,
            y: -5,
            z: -1.28
          })
          .to(this.room.scale, {
            x: 1.2,
            y: 1.2,
            z: 1.2,
          })
      },

      // Mobile
      "(max-width: 968px)": () => {
        console.log('mobile mode');
        // Resets
        this.room.position.set(0, 0, 0)
        this.room.scale.set(0.185, 0.185, 0.185)
        this.rectLight.width = 0.5
        this.rectLight.height = 0.95

        // First Section
        this.firstMoveTimeLine = new GSAP.timeline({
          scrollTrigger: {
            trigger: '.first-move',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            invalidateOnRefresh: true
          }
        }).to(this.room.scale, {
          x: 0.23,
          y: 0.23,
          z: 0.23,
        })
        // Second Section
        this.secondMoveTimeLine = new GSAP.timeline({
          scrollTrigger: {
            trigger: '.second-move',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            invalidateOnRefresh: true
          }
        })
          .to(this.room.position, {
            x: 1.2,
            z: 0.6
          }, 'same')
          .to(this.room.scale, {
            x: 0.5,
            y: 0.5,
            z: 0.5,
          }, 'same')
          .to(this.rectLight, {
            width: 0.5 * 2.5,
            height: 0.95 * 2.5
          }, 'same')
        // Third Section
        this.thirdMoveTimeLine = new GSAP.timeline({
          scrollTrigger: {
            trigger: '.third-move',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            invalidateOnRefresh: true
          }
        })
          .to(this.room.position, {
            z: -4
          }, 'same')
          .to(this.room.scale, {
            x: 0.7,
            y: 0.7,
            z: 0.7,
          }, 'same')
      },

      // all 
      "all": () => {
        // progress bar
        this.sections = document.querySelectorAll('.section')
        this.sections.forEach((section) => {
          this.progressWrapper = section.querySelector('.progress-wrapper')
          this.progressBar = section.querySelector('.progress-bar')

          if (section.classList.contains('right')) {
            GSAP.to(
              section,
              {
                borderTopLeftRadius: 10,
                scrollTrigger: {
                  trigger: section,
                  start: 'top bottom',
                  end: 'top top',
                  scrub: 0.6
                }
              }
            )

            GSAP.to(
              section,
              {
                borderBottomLeftRadius: 700,
                scrollTrigger: {
                  trigger: section,
                  start: 'bottom bottom',
                  end: 'bottom top',
                  scrub: 0.6
                }
              }
            )
          } else {
            GSAP.to(
              section,
              {
                borderTopRightRadius: 10,
                scrollTrigger: {
                  trigger: section,
                  start: 'top bottom',
                  end: 'top top',
                  scrub: 0.6
                }
              }
            )

            GSAP.to(
              section,
              {
                borderBottomRightRadius: 700,
                scrollTrigger: {
                  trigger: section,
                  start: 'bottom bottom',
                  end: 'bottom top',
                  scrub: 0.6
                }
              }
            )
          }

          GSAP.from(this.progressBar, {
            scaleY: 0,
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.4,
              pin: this.progressWrapper,
              pinSpacing: false
            }
          })
        })

        // Circle Animations------------------
        // First Section
        this.firstMoveTimeLine = new GSAP.timeline({
          scrollTrigger: {
            trigger: '.first-move',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            invalidateOnRefresh: true
          }
        }).to(this.circleFirst.scale, {
          x: 3,
          y: 3,
          z: 3,
        })

        // Second Section
        this.secondMoveTimeLine = new GSAP.timeline({
          scrollTrigger: {
            trigger: '.second-move',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            invalidateOnRefresh: true
          }
        }).to(this.circleSecond.scale, {
          x: 3,
          y: 3,
          z: 3,
        })

        // Third Section
        this.thirdMoveTimeLine = new GSAP.timeline({
          scrollTrigger: {
            trigger: '.third-move',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            invalidateOnRefresh: true
          }
        }).to(this.circleThird.scale, {
          x: 3,
          y: 3,
          z: 3,
        })

        // Mini Platform Animations
        // ScrollTriggers created here aren't associated with a particular media query,
        // so they persist.
        // console.log(this.room.children);
        this.secondPartTimeLine = new GSAP.timeline({
          scrollTrigger: {
            trigger: '.third-move',
            start: 'center center',
            end: 'bottom bottom',
            scrub: 0.6,
            invalidateOnRefresh: true
          }
        })

        this.room.children.forEach(child => {
          if (child.name == "MiniFloor") {
            child.receiveShadow = true
            this.ninth = GSAP.to(child.position, {
              x: -1.90223,
              z: 5.05628,
              duration: 3
            })
          }

          if (child.name == 'MailBox') {
            this.first = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              ease: 'back.out(2)',
              duration: 3
            })
          }

          if (child.name == 'Lamp') {
            this.second = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              ease: 'back.out(2)',
              duration: 3
            })
          }

          if (child.name == 'FloorFirst') {
            this.Third = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              ease: 'back.out(2)',
              duration: 3
            })
          }

          if (child.name == 'FlootSecond') {
            this.Forth = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              ease: 'back.out(2)',
              duration: 3
            })
          }

          if (child.name == 'FloorThird') {
            this.Fifth = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              ease: 'back.out(2)',
              duration: 3
            })
          }

          if (child.name == 'FlowerOne') {
            this.Sixth = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              ease: 'back.out(2)',
              duration: 3
            })
          }

          if (child.name == 'FlowerTwo') {
            this.Seventh = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              ease: 'back.out(2)',
              duration: 3
            })
          }

          if (child.name == 'Dirt') {
            this.Eighth = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              ease: 'back.out(2)',
              duration: 3
            })
          }
        })
        this.secondPartTimeLine.add(this.ninth)
        this.secondPartTimeLine.add(this.first, '-=0.1')
        this.secondPartTimeLine.add(this.second)
        this.secondPartTimeLine.add(this.Third)
        this.secondPartTimeLine.add(this.Forth)
        this.secondPartTimeLine.add(this.Fifth)
        this.secondPartTimeLine.add(this.Eighth)
        this.secondPartTimeLine.add(this.Sixth)
        this.secondPartTimeLine.add(this.Seventh)
      }
    });
  }

  onWheel() {
    window.addEventListener('wheel', (e) => {
      if (e.deltaY > 0) {
        this.lerp.target += 0.01
        this.back = false
      } else {
        this.lerp.target -= 0.01
        this.back = true
      }
    })
  }

  setPath() {
    //Create a closed wavey loop
    this.curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-5, 0, 0),
      new THREE.Vector3(0, 5, -5),
      new THREE.Vector3(5, 0, 0),
      new THREE.Vector3(0, -5, 5),
      new THREE.Vector3(12, 0, 0),
      new THREE.Vector3(0, 6, 0),
      new THREE.Vector3(12, 0, 5),
    ], true);

    const points = this.curve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

    // Create the final object to add to the scene
    const curveObject = new THREE.Line(geometry, material);
    this.scene.add(curveObject)
  }

  resize() {

  }

  update() {
    // this.lerp.current = GSAP.utils.interpolate(
    //   this.lerp.current,
    //   this.lerp.target,
    //   this.lerp.ease,
    // )
    // this.lerp.target += 0.001

    // if (this.back) {
    //   this.lerp.target -= 0.001
    // } else {
    //   this.lerp.target += 0.001
    // }

    // // 防止 current 和 target 小于 0 报错
    // this.lerp.current = GSAP.utils.clamp(0, 1, this.lerp.current)
    // this.lerp.target = GSAP.utils.clamp(0, 1, this.lerp.target)

    // this.curve.getPointAt(this.lerp.current, this.position)
    // this.curve.getPointAt(this.lerp.current + 0.00001, this.lookAtPosition)

    // this.camera.orthographicCamera.position.copy(this.position)
    // this.camera.orthographicCamera.lookAt(this.lookAtPosition)

    // this.curve.getPointAt(this.lerp.current % 1, this.position)
    // this.camera.orthographicCamera.position.copy(this.position)

    // this.directionalVector.subVectors(
    //   this.curve.getPointAt((this.lerp.current % 1) + 0.000001),
    //   this.position
    // )
    // this.directionalVector.normalize()
    // this.crossVector.crossVectors(
    //   this.directionalVector,
    //   this.staticVector
    // )
    // 将该向量与传入的向量相乘
    // this.crossVector.multiplyScalar(100000)
    // this.camera.orthographicCamera.lookAt(this.crossVector)
    // this.camera.orthographicCamera.lookAt(new THREE.Vector3(0, 0, 0))
  }
}