import * as THREE from "three";
import Main from "../../../main";

export default class Tree {
  constructor(_grass,height) {
    this.main = new Main();
    this.scene = this.main.scene;
    this.grass = _grass;
    this.time = this.main.time;
    this.height = height

    this.swingRandom = Math.floor(Math.random() * 10);

    this.setInstance();
  }

  setInstance() {
    this.instance = new THREE.Group();
    this.trunks = new THREE.Mesh(
      new THREE.BoxGeometry(5, 5, 10),
      new THREE.MeshBasicMaterial({ color: "brown" })
    );
    this.crown = new THREE.Mesh(
      new THREE.BoxGeometry(8, 8, this.height),
      // new THREE.ShaderMaterial({
      //   vertexShader: vertexShader,
      //   fragmentShader: fragmentShader,
      //   uniforms: {
      //     uTime: new THREE.Uniform(0),
      //   },
      // })
      new THREE.MeshStandardMaterial({ color: "green" })
    );
    this.trunks.castShadow = true;
    this.crown.castShadow = true;
    this.crown.position.z = this.height / 2 + 5;

    this.instance.add(this.trunks, this.crown);
    this.grass.group.add(this.instance);
  }

  update() {
    // this.crown.material.uniforms.uTime.value =
    //   this.time.elapsed * (this.swingRandom * 0.0005);
  }
}
