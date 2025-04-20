import * as THREE from "three";
import Main from "../../../main";
import { GRASS_COLOR, UNITS } from "../../../utils/constants";

export default class Grass {
  constructor(_row) {
    this.main = new Main();
    this.scene = this.main.scene;
    this.row = _row;

    this.setInstance();
  }

  setInstance() {
    this.group = new THREE.Group();
    this.group.position.y = this.row * UNITS;
    this.instance = new THREE.Mesh(
      new THREE.BoxGeometry(UNITS * 17, UNITS, 3),
      new THREE.MeshStandardMaterial({
        color: GRASS_COLOR,
      })
    );
    this.instance.receiveShadow = true;

    this.group.add(this.instance);

    this.scene.add(this.group);
  }
}
