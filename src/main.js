import Map from "./components/map/map";
import Player from "./components/player/player";
import Camera from "./engine/camera";
import Renderer from "./engine/renderer";
import Sizes from "./utils/sizes";
import Time from "./utils/time";
import * as THREE from "three";

let instance = null;

export default class Main {
  constructor() {
    if (instance) {
      return instance;
    }
    instance = this;

    this.canvas = document.querySelector("canvas.webgl");

    // Setup
    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new THREE.Scene();
    this.player = new Player();
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.map = new Map();

    // Resize event
    this.sizes.on("resize", () => {
      this.resize();
    });

    // Time tick event
    this.time.on("tick", () => {
      this.update();
    });
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  update() {
    this.renderer.update();
    this.map.update();
    this.player.update();
  }
}

const main = new Main();
