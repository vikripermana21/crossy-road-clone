import Main from "../../../main";
import * as THREE from "three";

export default class DirectionalLight {
  constructor() {
    this.main = new Main();
    this.scene = this.main.scene;

    this.setInstance();
  }

  setInstance() {
    this.instance = new THREE.DirectionalLight("white", 1);
    this.instance.position.set(-100, -100, 100);
    this.instance.castShadow = true;

    this.helper = new THREE.DirectionalLightHelper(this.instance, 1);
    this.scene.add(this.helper);

    // Configure shadow properties
    this.instance.shadow.mapSize.width = 2048;
    this.instance.shadow.mapSize.height = 2048;
    this.instance.shadow.camera.near = -10;
    this.instance.shadow.camera.far = 1000;
    this.instance.shadow.camera.left = -200;
    this.instance.shadow.camera.right = 200;
    this.instance.shadow.camera.top = 200;
    this.instance.shadow.camera.bottom = -200;

    this.scene.add(this.instance);
  }
}
