import Main from "../main";
import * as THREE from "three";

export default class Renderer {
  constructor() {
    this.main = new Main();
    this.camera = this.main.camera;
    this.scene = this.main.scene;
    this.canvas = this.main.canvas;
    this.sizes = this.main.sizes;

    this.setInstance();
  }

  setInstance() {
    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
    });
    this.instance.setClearColor("aliceblue");
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
    this.instance.shadowMap.enabled = true;
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
  }

  update() {
    this.instance.render(this.scene, this.camera.instance);
  }
}
