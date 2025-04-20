import Main from "../../main";
import { UNITS } from "../../utils/constants";
import { METADATA, TYPE } from "../../utils/metadata";
import Player from "../player/player";
import Grass from "./grass/grass";
import AmbientLight from "./light/ambientLight";
import DirectionalLight from "./light/directionalLight";
import Road from "./road/road";
import Car from "./road/vehicles/car";
import Tree from "./tree/tree";
import * as THREE from "three";

export default class Map {
  constructor() {
    this.main = new Main();
    this.scene = this.main.scene;
    this.trees = []; // Array to store all trees
    this.initialize();
  }

  getRandomSign() {
    return Math.random() < 0.5 ? -1 : 1;
  }

  initialize() {
    this.ambientLight = new AmbientLight();
    this.directionalLight = new DirectionalLight();

    new Array(5).fill(0).forEach((item, index) => {
      const grass = new Grass(-index);
    });

    METADATA.forEach((item, index) => {
      const row = index + 1;
      if (item.type === TYPE.FOREST) {
        const grass = new Grass(row);
        if (item.trees?.length > 0) {
          item.trees.forEach((item) => {
            const tree = new Tree(grass);
            tree.instance.position.x =
              UNITS * Math.floor(Math.random() * 8) * this.getRandomSign();
          });
        }
      }
      if (item.type === TYPE.ROAD) {
        const road = new Road(row);
        const car = new Car(road);
      }
    });
  }

  update() {
    this.trees.forEach((tree) => tree.update()); // Update all trees
  }
}
