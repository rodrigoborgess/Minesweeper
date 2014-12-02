Minesweeper
===========
The famous minesweeper game built with AngularJS and Bootstrap

<p>The game start with an 8x8 grid and 10 hidden mines by default, randomly placed into the board.</p>

<p><b>In progress:</b> implementation of webworker to support the generation of the board and don't get a browser message to stop the script in cases when the user set a large board grid in configuration section. A loading message while the board is getting built will be implemented as well.</p>

<h4>Additional functions</h4>
<ul>
<li>New Game: start a new, randomly generated game, based on the configuration attributes</li>
<li>Validate game: check if the user has correctly marked all the tiles and end the game in either victory or failure</li>
<li>Cheat this game!: reveal the locations of the mines without ending the game</li>
<li>Board configuration: you can configure the board grid with any combination of rows, columns and mines</li>
</ul>

<h4>Screenshots</h4>
![Alt text](https://github.com/rodrigoborgess/Minesweeper/blob/master/screenshots/screenshot_01.png "Minesweeper Screenshot 1")
![Alt text](https://github.com/rodrigoborgess/Minesweeper/blob/master/screenshots/screenshot_02.png "Minesweeper Screenshot 2")
![Alt text](https://github.com/rodrigoborgess/Minesweeper/blob/master/screenshots/screenshot_03.png "Minesweeper Screenshot 3")
