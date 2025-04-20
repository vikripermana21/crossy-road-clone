import * as THREE from "three";
import vertexShader from "./shader/player.vertex.glsl";
import fragmentShader from "./shader/player.fragment.glsl";
import { UNITS } from "../../utils/constants";
import Main from "../../main";

export default class Player {
  constructor() {
    this.main = new Main();
    this.scene = this.main.scene;
    this.lerpFactor = 0.1; // Controls the speed of interpolation (0-1)
    this.targetPosition = new THREE.Vector3();
    this.targetRotation = new THREE.Euler();
    this.isJumping = false;
    this.jumpHeight = 5; // Height of the jump
    this.jumpProgress = 0; // Progress of the jump (0 to 1)
    this.jumpSpeed = 0.05; // Speed of the jump animation

    this.moveClock = new THREE.Clock(false);
    this.moveQueue = [];

    this.setInstance();

    window.addEventListener("keydown", (e) => {
      if (this.isJumping) return; // Don't allow new jumps while already jumping

      if (e.key === "ArrowRight") {
        // this.targetPosition.x += UNITS;
        // this.targetRotation.z = Math.PI * 0.5;
        // this.startJump();
        this.moveQueue.push("right");
      }
      if (e.key === "ArrowLeft") {
        // this.targetPosition.x -= UNITS;
        // this.targetRotation.z = -Math.PI * 0.5;
        // this.startJump();
        this.moveQueue.push("left");
      }
      if (e.key === "ArrowUp") {
        // this.targetPosition.y += UNITS;
        // this.targetRotation.z = Math.PI;
        // this.startJump();
        this.moveQueue.push("up");
      }
      if (e.key === "ArrowDown") {
        // this.targetPosition.y -= UNITS;
        // this.targetRotation.z = 0;
        // this.startJump();
        this.moveQueue.push("down");
      }
    });
  }

  startJump() {
    this.isJumping = true;
    this.jumpProgress = 0;
    this.initialY = this.player.position.y;
  }

  updateJump() {
    if (!this.isJumping && this.moveQueue.length <= 0) return;

    this.jumpProgress += this.jumpSpeed;

    // Use a sine wave for smooth up and down motion
    const jumpOffset = Math.sin(this.jumpProgress * Math.PI) * this.jumpHeight;

    // Update the player's Y position
    this.player.position.y = this.initialY + jumpOffset;

    // End the jump when it's complete
    if (this.jumpProgress >= 1) {
      this.isJumping = false;
      this.player.position.y = this.initialY;
      this.moveQueue.shift();
      this.moveClock.stop();
    }
  }

  playerMove() {
    if (!this.moveClock.running) this.moveClock.start();

    const stepTime = 0.2; // Seconds it takes to take a step
    const progress = Math.min(1, this.moveClock.getElapsedTime() / stepTime);

    console.log(progress);
    if (this.moveQueue[0] === "right") {
      this.targetPosition.x += UNITS;
      this.targetRotation.z = Math.PI * 0.5;
    } else if (this.moveQueue[0] === "left") {
      this.targetPosition.x -= UNITS;
      this.targetRotation.z = -Math.PI * 0.5;
    } else if (this.moveQueue[0] === "up") {
      this.targetPosition.y += UNITS;
      this.targetRotation.z = Math.PI;
    } else if (this.moveQueue[0] === "down") {
      this.targetPosition.y -= UNITS;
      this.targetRotation.z = 0;
    } else {
      return;
    }
    this.startJump();
    if (progress >= 1) {
      this.moveQueue.shift();
      this.moveClock.stop();
    }
  }

  normalizeAngle(angle) {
    // Normalize angle to be between -PI and PI
    return ((angle + Math.PI) % (Math.PI * 2)) - Math.PI;
  }

  getShortestRotation(current, target) {
    // Normalize both angles
    const normalizedCurrent = this.normalizeAngle(current);
    const normalizedTarget = this.normalizeAngle(target);

    // Calculate the difference
    let diff = normalizedTarget - normalizedCurrent;

    // If the difference is greater than PI, go the other way
    if (diff > Math.PI) {
      diff -= Math.PI * 2;
    } else if (diff < -Math.PI) {
      diff += Math.PI * 2;
    }

    return current + diff;
  }

  setInstance() {
    this.instance = new THREE.Group();

    this.player = new THREE.Mesh(
      new THREE.BoxGeometry(5, 5, 7),
      new THREE.MeshStandardMaterial()
    );
    this.player.castShadow = true;
    this.player.receiveShadow = true;

    this.player.position.z = 5;
    this.targetPosition.copy(this.instance.position);
    this.targetRotation.copy(this.instance.rotation);
    this.initialY = this.player.position.y;

    this.instance.add(this.player);
    this.scene.add(this.instance);
  }

  update() {
    // Lerp the position
    this.instance.position.lerp(this.targetPosition, this.lerpFactor);

    // Get the shortest path rotation
    const shortestRotation = this.getShortestRotation(
      this.player.rotation.z,
      this.targetRotation.z
    );

    // Lerp the rotation
    this.player.rotation.z = THREE.MathUtils.lerp(
      this.player.rotation.z,
      shortestRotation,
      this.lerpFactor
    );

    this.playerMove();

    // Update jump animation
    this.updateJump();
  }
}
