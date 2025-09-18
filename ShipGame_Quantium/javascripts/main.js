import { Input } from "./input.js";
import { Game } from "./game.js";

const mount = document.getElementById("app");
const input = new Input();
const game = new Game(mount, input);

game.start();
