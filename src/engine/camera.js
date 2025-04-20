import * as THREE from "three";
import Main from "../main";

export default class Camera {
  constructor() {
    this.main = new Main();
    this.scene = this.main.scene;
    this.player = this.main.player;
    this.sizes = this.main.sizes;
    this.size = 300;
    this.viewRatio = window.innerWidth / window.innerHeight;
    this.width = this.viewRatio < 1 ? this.size : this.size * this.viewRatio;
    this.height = this.viewRatio < 1 ? this.size / this.viewRatio : this.size;

    this.setInstance();
  }

  setInstance() {
    this.instance = new THREE.OrthographicCamera(
      this.width / -2,
      this.width / 2,
      this.height / 2,
      this.height / -2,
      -10,
      10000
    );

    this.instance.up.set(0, 0, 1);
    this.instance.position.set(300, -300, 300);
    this.instance.lookAt(0, 0, 0);
    this.instance.receiveShadow = true;
    this.instance.castShadow = true;

    this.player.instance.add(this.instance);
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }
}
