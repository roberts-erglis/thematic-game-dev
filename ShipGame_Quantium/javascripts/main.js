import { Input } from "./input.js";
import { Game } from "./game.js";

const mount = document.getElementById("app");
const input = new Input();
const game = new Game(mount, input);

// Sanity check (optional):
// console.log("Game import:", Game);
// console.log("Instance methods:", Object.getOwnPropertyNames(Object.getPrototypeOf(game)));

game.start();
