import Main from "../../main";
import { UNITS } from "../../utils/constants";
import { randomElement } from "../../utils/helper";
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
    this.player = this.main.player
    this.time = this.main.time
    this.group = new THREE.Group()
    this.initializeGame();
  }

  getRandomSign() {
    return Math.random() < 0.5 ? -1 : 1;
  }

  initializeGame(){
  this.group.remove(...this.group.children);
  this.initializeMap()

  this.scene.add(this.group)
  }

  initializeMap() {
    
    this.ambientLight = new AmbientLight();
    this.group.add(this.ambientLight.instance)

    METADATA.length = 0

    new Array(5).fill(0).forEach((item, index) => {
      const grass = new Grass(-index,this.group);
      this.group.add(grass.instance)
    });

    new Array(5).fill(0).forEach((item, index) => {
      METADATA.push({
        type: TYPE.FOREST,
        trees:[]
      })
      const grass = new Grass(index,this.group)
    });
    
    this.addRows()
  }

  update() {
    this.animateVehicles()
  }

  addRows(){
    const newMetadata = this.generateRows(10)
    
    const startIndex = METADATA.length
    METADATA.push(...newMetadata)

    // Only process the newly added rows
    METADATA.slice(startIndex).forEach((item,index) => {
      const rowIndex = startIndex + index;

      if(item.type === TYPE.FOREST){
        const grass = new Grass(rowIndex,this.group)
        item.trees.forEach(item => {
          const tree = new Tree(grass,item.height)
          tree.instance.position.x = UNITS * item.tileIndex
        })
      }

      if(item.type === TYPE.CAR){
        const road = new Road(rowIndex,this.group)

        item.vehicles.forEach(vehicle => {
          const car = new Car(road,vehicle.color)
          car.instance.position.x = vehicle.initialIndex * UNITS
          car.instance.rotation.z = vehicle.direction ? Math.PI : 0

          vehicle.ref = car
        })
      }
    })
  }

  generateRows(iteration){
    const type = [TYPE.FOREST, TYPE.CAR]
    const tempArr = []
    new Array(iteration).fill(0).forEach((_,index) => {
      const randomIndex = Math.floor(Math.random() * 2)
      const randomType = type[randomIndex]

      if(randomType === TYPE.FOREST){

       const trees = new Array(THREE.MathUtils.randInt(0,4)).fill(0).map((_,index) => {
            return {
              tileIndex: THREE.MathUtils.randInt(-8,8),
              height:[10,20,30][Math.floor(Math.random() * 3)]
            }
        })

       tempArr.push(
        {
          type: TYPE.FOREST,
          trees: trees
        }
       ) 
      }

      if(randomType === TYPE.CAR){
        const direction = randomElement([true,false])
        const speed = randomElement([128,158,200])

        const occupiedTiles = new Set()

        const vehicles = new Array(2).fill(0).map((_,index) => {
          let initialIndex;

          do{
            initialIndex = THREE.MathUtils.randInt(-12,12);
          } while (occupiedTiles.has(initialIndex))
            occupiedTiles.add(initialIndex - 1);
            occupiedTiles.add(initialIndex);
            occupiedTiles.add(initialIndex + 1);

            const color = randomElement([0xa52523, 0xbdb638, 0x78b14b]);

            return {initialIndex, color}
          
        })

        tempArr.push({type: TYPE.CAR , vehicles, direction, speed})
      }
    })

    return tempArr
  }

  animateVehicles(){
    METADATA.forEach(item => {
      if(item.type === TYPE.FOREST) return

      const beginningOfRow = -12 * UNITS;
      const endOfRow = 12 * UNITS

      item.vehicles.forEach(({ref})=> {
        if (!ref) throw Error("reference is missing");
        if(item.direction){
          ref.instance.position.x = ref.instance.position.x > endOfRow ? beginningOfRow : ref.instance.position.x + item.speed * this.time.delta * 0.0007
        }else{
          ref.instance.position.x = ref.instance.position.x < beginningOfRow ? endOfRow : ref.instance.position.x - item.speed * this.time.delta * 0.0007
        }
      })
    })
  }
}
