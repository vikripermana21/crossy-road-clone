import * as THREE from "three";
import Main from "../../../main";
import { GRASS_COLOR, UNITS } from "../../../utils/constants";

export default class Grass {
  constructor(_row,parent) {
    this.main = new Main();
    this.scene = this.main.scene;
    this.map = this.main.map
    this.row = _row;
    this.parent = parent

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

    this.parent.add(this.group);
  }
}
