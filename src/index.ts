// Import stylesheets
import * as GOL from './GameOfLife';

const appDiv: HTMLElement = document.getElementById('gol-app') as HTMLElement;
GOL.initGame('gol-app');
