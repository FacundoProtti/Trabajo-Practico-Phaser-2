import Game from "./scenes/Game.js";
import NextLevel from "./scenes/NextLevel.js";
import ThirdLevel from "./scenes/ThirdLevel.js";



// Create a new Phaser config object
const config = {
  type: Phaser.AUTO,
  width: 600,
  height: 400,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 800,
      height: 600,
    },
    max: {
      width: 2160,
      height: 1620,
    },
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 }, // Gravedad en cero para un juego top-down
      debug: true,
    },
  },
  // List of scenes to load
  // Only the first scene will be shown
  // Remember to import the scene before adding it to the list
  scene: [Game, NextLevel, ThirdLevel],
};

// Create a new Phaser game instance
window.game = new Phaser.Game(config);
