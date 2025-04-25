import * as THREE from "three";
import { ROAD_COLOR, UNITS } from "../../../utils/constants";
import Main from "../../../main";

export default class Road {
  constructor(row,parent) {
    this.main = new Main();
    this.scene = this.main.scene;
    this.row = row;
    this.parent = parent

    this.setInstance();
  }

  setInstance() {
    this.instance = new THREE.Group();

    this.road = new THREE.Mesh(
      new THREE.BoxGeometry(UNITS * 17, UNITS, 3),
      new THREE.MeshBasicMaterial({ color: ROAD_COLOR })
    );

    this.road.receiveShadow = true;

    this.instance.position.y = this.row * UNITS;

    this.instance.add(this.road);
    this.parent.add(this.instance);
  }
}
