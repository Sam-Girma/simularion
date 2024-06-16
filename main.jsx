import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OutlineEffect } from "three/examples/jsm/effects/OutlineEffect.js";
import GSAP from "gsap";
import { Pane } from "tweakpane";
import axios from "axios";

const PARAMS = {
  bg: 0x4b46b2,
  hand: 0xe7a183,
  shirt: 0x303030,
  vest: 0xe7d55c,
  wrist: 0.1,
  thumb: 0.0,
  index: 0.0,
  middle: 0.0,
  ring: 0.0,
  pinky: 0.25,
  thumbz: -0.09,
  indexz: -0.28,
  middlez: -0.08,
  ringz: -0.13,
  pinkyz: -0.4,
};

// Buttons
const raisedHand = document.querySelector("#raised-hand");
const raisedFinger = document.querySelector("#raised-finger");

const centerThresholdX = 10;
const centerThresholdY = 20;

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
const bgColor = new THREE.Color(PARAMS.bg);
scene.background = bgColor;

/**
 * Model
 */
const gltfLoader = new GLTFLoader();

gltfLoader.load("hand.glb", (gltf) => {
  scene.add(gltf.scene.children[0]);

  setMaterials();
  setBones();
});

// Materials
const handMaterial = new THREE.MeshToonMaterial();
const shirtMaterial = new THREE.MeshToonMaterial();
const vestMaterial = new THREE.MeshToonMaterial();

const setMaterials = () => {
  const textureLoader = new THREE.TextureLoader();
  const gradientTexture = textureLoader.load("3.jpg");
  gradientTexture.minFilter = THREE.NearestFilter;
  gradientTexture.magFilter = THREE.NearestFilter;
  gradientTexture.generateMipmaps = false;

  handMaterial.color = new THREE.Color(PARAMS.hand);
  handMaterial.gradientMap = gradientTexture;
  handMaterial.roughness = 0.7;
  handMaterial.emissive = new THREE.Color(PARAMS.hand);
  handMaterial.emissiveIntensity = 0.2;
  scene.getObjectByName("Hand").material = handMaterial;

  shirtMaterial.color = new THREE.Color(PARAMS.shirt);
  shirtMaterial.gradientMap = gradientTexture;
  scene.getObjectByName("Shirt").material = shirtMaterial;

  vestMaterial.color = new THREE.Color(PARAMS.vest);
  vestMaterial.gradientMap = gradientTexture;
  scene.getObjectByName("Vest").material = vestMaterial;
};

const setBones = () => {
  const wrist = scene.getObjectByName("Hand").skeleton.bones[0];
  const wrist1 = scene.getObjectByName("Hand").skeleton.bones[1];
  const wrist2 = scene.getObjectByName("Hand").skeleton.bones[2];
  const wrist3 = scene.getObjectByName("Hand").skeleton.bones[6];
  const wrist4 = scene.getObjectByName("Hand").skeleton.bones[10];
  const wrist5 = scene.getObjectByName("Hand").skeleton.bones[14];
  const wrist6 = scene.getObjectByName("Hand").skeleton.bones[18];
  wrist1.rotation.x = PARAMS.wrist;
  wrist2.rotation.x = PARAMS.wrist;
  wrist3.rotation.x = PARAMS.wrist;
  wrist4.rotation.x = PARAMS.wrist;
  wrist5.rotation.x = PARAMS.wrist;
  wrist6.rotation.x = PARAMS.wrist;

  const thumb1 = scene.getObjectByName("Hand").skeleton.bones[3];
  const thumb2 = scene.getObjectByName("Hand").skeleton.bones[4];
  const thumb3 = scene.getObjectByName("Hand").skeleton.bones[5];
  thumb1.rotation.x = PARAMS.thumb;
  thumb2.rotation.x = PARAMS.thumb;
  thumb3.rotation.x = PARAMS.thumb;
  thumb1.rotation.z = PARAMS.thumbz;
  thumb2.rotation.z = PARAMS.thumbz;
  thumb3.rotation.z = PARAMS.thumbz;

  const index1 = scene.getObjectByName("Hand").skeleton.bones[7];
  const index2 = scene.getObjectByName("Hand").skeleton.bones[8];
  const index3 = scene.getObjectByName("Hand").skeleton.bones[9];
  index1.rotation.x = PARAMS.index;
  index2.rotation.x = PARAMS.index;
  index3.rotation.x = PARAMS.index;

  const middle1 = scene.getObjectByName("Hand").skeleton.bones[11];
  const middle2 = scene.getObjectByName("Hand").skeleton.bones[12];
  const middle3 = scene.getObjectByName("Hand").skeleton.bones[13];
  middle1.rotation.x = PARAMS.middle;
  middle2.rotation.x = PARAMS.middle;
  middle3.rotation.x = PARAMS.middle;

  const ring1 = scene.getObjectByName("Hand").skeleton.bones[15];
  const ring2 = scene.getObjectByName("Hand").skeleton.bones[16];
  const ring3 = scene.getObjectByName("Hand").skeleton.bones[17];
  ring1.rotation.x = PARAMS.ring;
  ring2.rotation.x = PARAMS.ring;
  ring3.rotation.x = PARAMS.ring;

  const pinky1 = scene.getObjectByName("Hand").skeleton.bones[19];
  const pinky2 = scene.getObjectByName("Hand").skeleton.bones[20];
  const pinky3 = scene.getObjectByName("Hand").skeleton.bones[21];
  pinky1.rotation.x = PARAMS.pinky;
  pinky2.rotation.x = PARAMS.pinky;
  pinky3.rotation.x = PARAMS.pinky;

  const wristRotation = [
    wrist.rotation,
    wrist1.rotation,
    wrist2.rotation,
    wrist3.rotation,
    wrist4.rotation,
    wrist5.rotation,
    wrist6.rotation,
  ];
  const thumbRotation = [thumb1.rotation, thumb2.rotation, thumb3.rotation];
  const indexRotation = [index1.rotation, index2.rotation, index3.rotation];
  const middleRotation = [middle1.rotation, middle2.rotation, middle3.rotation];
  const ringRotation = [ring1.rotation, ring2.rotation, ring3.rotation];
  const pinkyRotation = [pinky1.rotation, pinky2.rotation, pinky3.rotation];

  var raisedHand = () => {
    const tlRaisedHand = GSAP.timeline();
    let bgColor = new THREE.Color(0x4b46b2);
    let handColor = new THREE.Color(0xe7a183);
    let shirtColor = new THREE.Color(0x303030);
    let vestColor = new THREE.Color(0xe7d55c);

    tlRaisedHand
      .to(
        PARAMS,
        {
          duration: 0,
          bg: 0x4b46b2,
          hand: 0xe7a183,
          shirt: 0x303030,
          vest: 0xe7d55c,
          wrist: 0,
          thumb: 0,
          index: 0,
          middle: 0,
          ring: 0,
          pinky: 0,
          thumbz: -0.15,
          indexz: -0.3,
          middlez: -0.08,
          ringz: -0.22,
          pinkyz: -0.52,
        },
        "same"
      )
      .to(wristRotation, { duration: 0.5, x: 0 }, "same")
      .to(thumbRotation, { duration: 0.5, x: 0 }, "same")
      .to(indexRotation, { duration: 0.5, x: 0 }, "same")
      .to(middleRotation, { duration: 0.5, x: 0 }, "same")
      .to(ringRotation, { duration: 0.5, x: 0 }, "same")
      .to(pinkyRotation, { duration: 0.5, x: 0 }, "same")
      .to(thumbRotation, { duration: 0.5, z: -0.15 }, "same")
      .to(indexRotation[0], { duration: 0.5, z: -0.3 }, "same")
      .to(middleRotation[0], { duration: 0.5, z: -0.08 }, "same")
      .to(ringRotation[0], { duration: 0.5, z: 0.22 }, "same")
      .to(pinkyRotation[0], { duration: 0.5, z: 0.52 }, "same")
      .to(
        scene.background,
        { duration: 0.5, r: bgColor.r, g: bgColor.g, b: bgColor.b },
        "same"
      )
      .to(
        handMaterial.color,
        { duration: 0.5, r: handColor.r, g: handColor.g, b: handColor.b },
        "same"
      )
      .to(
        handMaterial.emissive,
        { duration: 0.5, r: handColor.r, g: handColor.g, b: handColor.b },
        "same"
      )
      .to(
        shirtMaterial.color,
        { duration: 0.5, r: shirtColor.r, g: shirtColor.g, b: shirtColor.b },
        "same"
      )
      .to(
        vestMaterial.color,
        { duration: 0.5, r: vestColor.r, g: vestColor.g, b: vestColor.b },
        "same"
      )
      .play();
  };

  var raisedFinger = () => {
    const tlRaisedFinger = GSAP.timeline();
    let bgColor = new THREE.Color(0xaf5f54);
    let handColor = new THREE.Color(0xe7a183);
    let shirtColor = new THREE.Color(0x303030);
    let vestColor = new THREE.Color(0x274479);

    tlRaisedFinger
      .to(
        PARAMS,
        {
          duration: 0,
          bg: 0xaf5f54,
          hand: 0xe7a183,
          shirt: 0x303030,
          vest: 0x274479,
          wrist: 0,
          thumb: 0.9,
          index: 0,
          middle: 1.25,
          ring: 1.25,
          pinky: 1.15,
          thumbz: -0.15,
          indexz: -0.3,
          middlez: -0.08,
          ringz: -0.22,
          pinkyz: -0.52,
        },
        "same"
      )
      .to(wristRotation, { duration: 0.5, x: 0 }, "same")
      .to(thumbRotation, { duration: 0.5, x: 0.9 }, "same")
      .to(indexRotation, { duration: 0.5, x: 1.1 }, "same")
      .to(middleRotation, { duration: 0.5, x: 1.25 }, "same")
      .to(ringRotation, { duration: 0.5, x: 1.25 }, "same")
      .to(pinkyRotation, { duration: 0.5, x: 1.15 }, "same")
      .to(thumbRotation, { duration: 0.5, z: -0.15 }, "same")
      .to(indexRotation[0], { duration: 0.5, z: -0.3 }, "same")
      .to(middleRotation[0], { duration: 0.5, z: -0.08 }, "same")
      .to(ringRotation[0], { duration: 0.5, z: 0.22 }, "same")
      .to(pinkyRotation[0], { duration: 0.5, z: 0.52 }, "same")
      .to(
        scene.background,
        { duration: 0.5, r: bgColor.r, g: bgColor.g, b: bgColor.b },
        "same"
      )
      .to(
        handMaterial.color,
        { duration: 0.5, r: handColor.r, g: handColor.g, b: handColor.b },
        "same"
      )
      .to(
        handMaterial.emissive,
        { duration: 0.5, r: handColor.r, g: handColor.g, b: handColor.b },
        "same"
      )
      .to(
        shirtMaterial.color,
        { duration: 0.5, r: shirtColor.r, g: shirtColor.g, b: shirtColor.b },
        "same"
      )
      .to(
        vestMaterial.color,
        { duration: 0.5, r: vestColor.r, g: vestColor.g, b: vestColor.b },
        "same"
      )
      .play();
  };

  const button = document.getElementById("connectButton");
  const desiredPortName = "COM13";
  const baudRate = 9600;

  button.addEventListener("click", async () => {
    var sendLogs = async (time, numberData, gestureType, serialPortInfo) => {
      console.log("calling");
      const url = "http://localhost:8001/save-logs"; // Replace with your server URL if different
      const data = {
        time,
        numberData,
        gestureType,
        // serialPortInfo,
      };

      try {
        const response = await axios.post(url, data, {
          headers: {
            "Content-Type": "application/json",
          },
          // withCredentials: true,
        });

        if (response.data) {
          console.log(response.data);
          console.log("done");
        } else {
          console.error("Error sending logs:", response.statusText);
        }
      } catch (error) {
        console.error("Error sending logs:", error);
      }
    };

    // Example usage
    // const numberValue = 123.45;
    // const gesture = "swipe";
    // const serialPort = "COM3";

    // sendLogs(currentTime, numberValue, gesture, serialPort);
    try {
      // const port = await navigator.serial.requestPort();

      // const port = await navigator.serial.requestPort({ filters: [{ name: desiredPortName }] });
      const port = await navigator.serial.requestPort();

      console.log(port);

      // Check if the port name matches
      // if (port.name !== desiredPortName) {
      //   console.error(`Port name doesn't match: ${port.name}`);
      //   return;
      // }

      // Open the serial port
      await port.open({ baudRate });

      // console.log(`Connected to ${port.name} at ${baudRate} baud`);

      // Function to read data from the port
      const readData = async () => {
        const reader = port.readable.getReader();

        var is_open = true;

        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) {
              console.log("Reader has been canceled, exiting loop.");
              break;
            }
            const text = new TextDecoder().decode(value);
            const line = text.trim();
            if (line && parseInt(line) > 30) {
              console.log("Received data:", line);
              if (line < 80 && line > 40) {
                console.log(line);
                raisedHand();
                is_open = !is_open;
              } else if (line > 80) {
                console.log(line);
                raisedFinger();
                is_open = !is_open;
              }
            }
            // await new Promise((resolve) => setTimeout(resolve, 100));

            // Process the received data here

            // const { value } = await reader.read();
            // console.log(value);
            // const { value } = value;
            // if (value) {
            //   // Process the received data (e.g., convert to string, display)
            //   // const decoder = new TextDecoder();
            //   console.log(value);
            //   const dataString = new DataView(value.buffer).getUint8(0);
            //   if (dataString < 100) {
            //     console.log(dataString);
            //     raisedHand();
            //     is_open = !is_open;
            //   } else if (dataString > 100) {
            //     console.log(dataString);
            //     raisedFinger();
            //     is_open = !is_open;
            //   }
            // sendLogs(new Date().toISOString(), parseInt(dataString), is_open ? "open-hand" : "closed-hand", port.name);
            await new Promise((resolve) => setTimeout(resolve, 100));
            // } else {
            //   // Reader closed
            //   break;
            // }
          }
        } catch (error) {
          console.error("Error reading data:", error);
        } finally {
          reader.releaseLock();
        }
      };

      // Continuously read data
      readData();

      // Rest of your code to open and read from the port
    } catch (error) {
      console.error("Error:", error);
    }
  });
};

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(-5, 5, 5);
directionalLight.scale.set(0.5, 0.5, 0.5);
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  outlineEffect.setSize(sizes.width, sizes.height);
  outlineEffect.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0, 0, 5);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0, 0);
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI / 2;
controls.minDistance = 3;
controls.maxDistance = 10;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const outlineEffect = new OutlineEffect(renderer, {
  defaultThickness: 0.0035,
  defaultColor: [0, 0, 0],
  defaultAlpha: 0.8,
  defaultKeepAlive: true,
});
/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Update controls
  controls.update();

  // Render
  outlineEffect.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

// const desiredPortName = 'COM13';
// const baudRate = 9600;

// async function checkAndReadSerialPort() {
//   try {
//     // Check for Web Serial API support
//     if (!navigator.serial) {
//       console.error('Web Serial API not supported');
//       return;
//     }
//     else{
//       console.log("done")
//     }

//     // Request a serial port (replace with getPorts() if needed)

//   } catch (error) {
//     console.error('Error:', error);
//   }
// }

// checkAndReadSerialPort();
