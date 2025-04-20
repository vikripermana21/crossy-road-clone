import Main from "../../../main";
import * as THREE from "three";

export default class AmbientLight {
  constructor() {
    this.main = new Main();
    this.scene = this.main.scene;

    this.setInstance();
  }

  setInstance() {
    this.instance = new THREE.AmbientLight("white", 2);
    this.scene.add(this.instance);
  }
}
