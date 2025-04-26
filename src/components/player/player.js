import * as THREE from "three";
import Main from "../../main";
import { UNITS } from "../../utils/constants";
import { METADATA, TYPE } from "../../utils/metadata";

export default class Player {
  constructor() {
    this.scoreText = document.querySelector("p#text-score");
    this.upBtn = document.querySelector("button.up");
    this.downBtn = document.querySelector("button.down");
    this.leftBtn = document.querySelector("button.left");
    this.rightBtn = document.querySelector("button.right");
    this.gameOver = document.querySelector("div.game-over");
    this.retryBtn = document.querySelector("span.retry");
    this.finalScore = document.querySelector("p.final-score");
    this.highScore = document.querySelector("span.high-score");

    this.main = new Main();
    this.scene = this.main.scene;
    this.map = this.main.map;
    this.targetPosition = new THREE.Vector3();
    this.targetRotation = new THREE.Euler();

    this.moveClock = new THREE.Clock(false);
    this.moveQueue = [];
    this.lastMove = "";
    this.isGameOver = false;

    this.position = {
      currentRow: 0,
      currentTile: 0,
    };

    this.currentRotation = 0;

    this.setInstance();

    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight" || e.key === "d") {
        this.queueMove("right");
      }
      if (e.key === "ArrowLeft" || e.key === "a") {
        this.queueMove("left");
      }
      if (e.key === "ArrowUp" || e.key === "w") {
        this.queueMove("up");
      }
      if (e.key === "ArrowDown" || e.key === "s") {
        this.queueMove("down");
      }
    });

    this.upBtn.addEventListener("click", () => {
      this.queueMove("up");
    });

    this.downBtn.addEventListener("click", () => {
      this.queueMove("down");
    });

    this.leftBtn.addEventListener("click", () => {
      this.queueMove("left");
    });

    this.rightBtn.addEventListener("click", () => {
      this.queueMove("right");
    });

    this.retryBtn.addEventListener("click", () => {
      this.reset();
    });
  }

  setInstance() {
    this.instance = new THREE.Group();

    this.player = new THREE.Mesh(
      new THREE.BoxGeometry(5, 5, 7),
      new THREE.MeshStandardMaterial()
    );
    this.player.castShadow = true;
    this.player.receiveShadow = true;

    this.instance.position.z = 5;
    this.targetPosition.copy(this.instance.position);
    this.targetRotation.copy(this.instance.rotation);
    this.initialY = this.player.position.y;

    this.instance.add(this.player);
    this.scene.add(this.instance);
  }

  update() {
    this.animatePlayer();
    this.hitTest();
  }

  calculateFinalPosition(currentPosition, moves) {
    return moves.reduce((position, direction) => {
      if (direction === "up")
        return {
          rowIndex: position.rowIndex + 1,
          tileIndex: position.tileIndex,
        };
      if (direction === "down")
        return {
          rowIndex: position.rowIndex - 1,
          tileIndex: position.tileIndex,
        };
      if (direction === "left")
        return {
          rowIndex: position.rowIndex,
          tileIndex: position.tileIndex - 1,
        };
      if (direction === "right")
        return {
          rowIndex: position.rowIndex,
          tileIndex: position.tileIndex + 1,
        };
      return position;
    }, currentPosition);
  }

  queueMove(direction) {
    if (this.isGameOver) return;
    const finalPosition = this.calculateFinalPosition(
      {
        rowIndex: this.position.currentRow,
        tileIndex: this.position.currentTile,
      },
      [...this.moveQueue, direction]
    );

    if (
      finalPosition.rowIndex === -1 ||
      finalPosition.tileIndex === -9 ||
      finalPosition.tileIndex === 9
    ) {
      return;
    }

    const finalRow = METADATA[finalPosition.rowIndex];
    if (
      finalRow &&
      finalRow.type === TYPE.FOREST &&
      finalRow?.trees?.some(
        (tree) => tree.tileIndex === finalPosition.tileIndex
      )
    ) {
      return;
    }
    this.moveQueue.push(direction);
  }

  stepCompleted() {
    if (this.moveQueue[0] === "right") this.position.currentTile += 1;
    if (this.moveQueue[0] === "left") this.position.currentTile -= 1;
    if (this.moveQueue[0] === "up") this.position.currentRow += 1;
    if (this.moveQueue[0] === "down") this.position.currentRow -= 1;

    if (this.moveQueue.length >= 1) this.lastMove = this.moveQueue[0];

    if (this.position.currentRow > METADATA.length - 10) this.map.addRows();

    this.scoreText.innerHTML = this.position.currentRow;

    this.moveQueue.shift();
  }
  rotationCompleted() {
    if (this.moveQueue[0] === "right") this.currentRotation = -Math.PI * 0.5;
    if (this.moveQueue[0] === "left") this.currentRotation = Math.PI * 0.5;
    if (this.moveQueue[0] === "up") this.currentRotation = 0;
    if (this.moveQueue[0] === "down") this.currentRotation = Math.PI;
  }

  setPosition(progress) {
    const initialX = this.position.currentTile * UNITS;
    const initialY = this.position.currentRow * UNITS;
    let targetX = initialX;
    let targetY = initialY;

    if (this.moveQueue[0] === "right") targetX += UNITS;
    if (this.moveQueue[0] === "left") targetX -= UNITS;
    if (this.moveQueue[0] === "up") targetY += UNITS;
    if (this.moveQueue[0] === "down") targetY -= UNITS;

    this.instance.position.x = THREE.MathUtils.lerp(
      initialX,
      targetX,
      progress
    );
    this.instance.position.y = THREE.MathUtils.lerp(
      initialY,
      targetY,
      progress
    );
    this.player.position.z = Math.sin(progress * Math.PI) * 5;
  }

  setRotation(progress) {
    let targetRotation = this.currentRotation;

    if (this.moveQueue[0] === "right") targetRotation = -Math.PI * 0.5;
    if (this.moveQueue[0] === "left") targetRotation = Math.PI * 0.5;
    if (this.moveQueue[0] === "up") targetRotation = 0;
    if (this.moveQueue[0] === "down") targetRotation = Math.PI;

    // Normalize angles to be between -PI and PI
    const normalizeAngle = (angle) => {
      return (
        angle - 2 * Math.PI * Math.floor((angle + Math.PI) / (2 * Math.PI))
      );
    };

    const current = normalizeAngle(this.currentRotation);
    const target = normalizeAngle(targetRotation);

    // Calculate the shortest rotation
    let shortestRotation = target - current;
    if (shortestRotation > Math.PI) shortestRotation -= 2 * Math.PI;
    if (shortestRotation < -Math.PI) shortestRotation += 2 * Math.PI;

    // Apply the rotation
    this.player.rotation.z = THREE.MathUtils.lerp(
      current,
      current + shortestRotation,
      progress
    );
  }

  animatePlayer() {
    if (!this.moveQueue.length) return;

    if (!this.moveClock.running) this.moveClock.start();

    const stepTime = 0.2;
    const progress = Math.min(1, this.moveClock.getElapsedTime() / stepTime);

    this.setRotation(progress);
    this.setPosition(progress);

    if (progress >= 1) {
      this.rotationCompleted();
      this.stepCompleted();
      this.moveClock.stop();
    }
  }

  hitTest() {
    const highScore = localStorage.getItem("score");
    if (this.position.currentRow > highScore) {
      localStorage.setItem("score", this.position.currentRow);
    }
    const row = METADATA[this.position.currentRow];

    if (row.type === TYPE.CAR) {
      const playerBoundingBox = new THREE.Box3();
      playerBoundingBox.setFromObject(this.instance);

      row.vehicles.forEach(({ ref }) => {
        if (!ref) throw Error("Vehicle reference is missing");

        const vehicleBoundingBox = new THREE.Box3();
        vehicleBoundingBox.setFromObject(ref.instance);

        if (playerBoundingBox.intersectsBox(vehicleBoundingBox)) {
          this.isGameOver = true;
          this.highScore.innerHTML = highScore;
          this.finalScore.innerHTML = this.position.currentRow;
          this.gameOver.style.visibility = "visible";
        }
      });
    }
  }

  reset() {
    this.map.initializeGame();
    this.scoreText.innerHTML = 0;
    // Initialize the Three.js player object
    this.instance.position.x = 0;
    this.instance.position.y = 0;
    this.player.position.z = 5;
    this.instance.children[0].position.z = 0;

    //  Initialize metadata
    this.position.currentRow = 0;
    this.position.currentTile = 0;

    //  Clear the moves queue
    this.moveQueue.length = 0;

    this.isGameOver = false;
  }
}
