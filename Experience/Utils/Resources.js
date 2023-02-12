import EventEmitter from "events";
import Experience from "../Experience";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import * as THREE from 'three'

export default class Resources extends EventEmitter {
    constructor(assets) {
        super()
        this.experience = new Experience()
        this.renderer = this.experience.renderer

        this.assets = assets

        this.items = {}
        this.queue = this.assets.length
        this.loaded = 0

        this.setLoaders()
        this.startingLoading()
    }

    setLoaders() {
        this.loaders = {}
        this.loaders.gltfLoader = new GLTFLoader()
        this.loaders.dracoLoader = new DRACOLoader()
        // 项目开发环境使用
        // this.loaders.dracoLoader.setDecoderPath('/draco/')
        // 项目打包上线环境使用
        this.loaders.dracoLoader.setDecoderPath('draco/')
        this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader)
    }

    startingLoading() {
        for (let asset of this.assets) {
            if (asset.type == 'glbModel') {
                this.loaders.gltfLoader.load(asset.path, (file) => {
                    this.singleAssetLoaded(asset, file)
                })
            } else if (asset.type == 'videoTexture') {
                this.video = {}
                this.videoTextures = {}

                this.video[asset.name] = document.createElement('video')
                this.video[asset.name].src = asset.path
                this.video[asset.name].muted = true
                this.video[asset.name].playsInLine = true
                this.video[asset.name].autoplay = true
                this.video[asset.name].loop = true
                this.video[asset.name].play()

                this.videoTextures[asset.name] = new THREE.VideoTexture(this.video[asset.name])
                this.videoTextures[asset.name].flipY = false
                this.videoTextures[asset.name].minFilter = THREE.NearestFilter
                this.videoTextures[asset.name].magFilter = THREE.NearestFilter
                this.videoTextures[asset.name].generateMipmaps = false
                this.videoTextures[asset.name].encoding = THREE.sRGBEncoding

                this.singleAssetLoaded(asset, this.videoTextures[asset.name])
            }
        }
    }

    singleAssetLoaded(asset, file) {
        this.items[asset.name] = file
        this.loaded++
        if (this.loaded === this.queue) {
            this.emit('ready')
        }
    }
}