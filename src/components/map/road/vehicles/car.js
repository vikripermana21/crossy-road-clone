import * as THREE from "three";
export default class Car {
  constructor(_road) {
    this.road = _road;
    this.setInstance();
  }

  setInstance() {
    this.instance = new THREE.Group();

    this.body = new THREE.Mesh(
      new THREE.BoxGeometry(20, 10, 7),
      new THREE.MeshStandardMaterial({ color: "red" })
    );

    this.body.receiveShadow = true;

    this.head = new THREE.Mesh(
      new THREE.BoxGeometry(10, 9, 5),
      new THREE.MeshStandardMaterial()
    );

    this.head.receiveShadow = true;

    this.wheel = new THREE.Group();

    this.frontWheel = new THREE.Mesh(
      new THREE.BoxGeometry(5, 13, 3),
      new THREE.MeshStandardMaterial({
        color: "black",
      })
    );

    this.frontWheel.position.x = -5;

    this.backWheel = new THREE.Mesh(
      new THREE.BoxGeometry(5, 13, 3),
      new THREE.MeshStandardMaterial({
        color: "black",
      })
    );
    this.backWheel.position.x = 5;

    this.wheel.add(this.frontWheel, this.backWheel);

    this.wheel.position.z = -3;

    this.head.position.z = 4;

    this.instance.position.z = 6;

    this.instance.add(this.body);
    this.instance.add(this.head);
    this.instance.add(this.wheel);

    this.road.instance.add(this.instance);
  }
}
