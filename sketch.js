// team the Cure
// this is the js file were the algorithm is being run to draw the maze
var maze; //variable to hold the maze that will be created

//setup function to create the canvas and grid
function setup() {
	//create a 40x40 grid 
	createCanvas(800, 800);
	var cell_size = 20; //each cell will be 20px
	var column = floor(width / cell_size);
	var row = floor(height / cell_size);
	//call the generate_maze funcction and pass in the variables to create it
	maze = new generate_maze(row, column, cell_size);
	maze.initialize();
	//set the frame rate to control the speed at which the maze is being generated
	frameRate(30);
}
//call draw function to draw grid
function draw() {
	background(255);
	//the build function wiill begin building the grid a set at a time
	maze.build();
	//call update_display function to update the display
	maze.update_display();
}

//generate the maze
function generate_maze(row, column, cell_size) {
	this.row = row;
	this.column = column;
	this.size = cell_size;
	//create an array to place all the edges or walls in
	this.walls = [];
	//variable to hold funnciton that will connect the edges
	this.connect = new connection();
	this.index = 0;
	this.initialize = function () {
		//loop through and place the edges in the walls array
		for (var i = 0; i <= this.row; i++) {
			for (var j = 0; j < this.column; j++) {
				this.walls.push(new wall(i, j, i, j + 1, this.size));
			}
		}
		for (var j = 0; j <= this.column; j++) {
			for (var i = 0; i < this.row; i++) {
				this.walls.push(new wall(i, j, i + 1, j, this.size));
			}
		}
		//now we are goign to sort the edges in the walls array randomly for when they get chosen randomly
		this.walls.sort(function randomSort(a, b) {
			return Math.random() > 0.5 ? -1 : 1;
		});
		for (var k = 0; k < this.row; k++) {
			for (var l = 0; l < this.column; l++) {
				this.connect.connect.push(new cell(k, l, this.row, this.column));
			}
		}
	}
	//  the update display function to update the display
	this.update_display = function () {
		for (var i = 0; i < this.walls.length; i++) {
			this.walls[i].neighbor(false);
		}
		this.walls[this.index].neighbor(true);
		for (var i = 0; i < this.walls.length; i++) {
			this.walls[i].show();
		}
	}
	// build the maze
	this.build = function () {
		//go through the walls starting from first index
		var wall = this.walls[this.index];
		//make sure walls are not outside of grid
		var grid_border = (wall.i == wall.k && (wall.i == 0 || wall.i == this.row)) || (wall.j == wall.l && (wall.j == 0 || wall.j == this.column));

		if (grid_border == false) {
			var first_column;
			var second_column;
			if (wall.i == wall.k) {
				first_column = (wall.i - 1) * this.column + wall.j;
				second_column = wall.i * this.column + wall.j;
			} else if (wall.j == wall.l) {
				first_column = wall.i * this.column + wall.j - 1;
				second_column = wall.i * this.column + wall.j;
			}
			//check to see if it is inside the set 
			var first = this.connect.check_inside(first_column);
			var second = this.connect.check_inside(second_column);
			if (first != second) {
				//destroy the walls between them
				this.walls[this.index].breaked = true;
				//now connect the edges
				this.connect.connect_edges(first_column, second_column);
			}
		}
		//iterate to the next index
		this.index++;
		if (this.index >= this.walls.length) {
			this.index = this.walls.length - 1;
		}
	}
}

function cell(i, j, row, column) {
	this.row = row;
	this.column = column;
	this.i = i;
	this.j = j;
	this.index = i * column + j;

	this.node = i * column + j;
}

function connection() {
	this.connect = [];
	this.check_inside = function (i) {
		var p = this.connect[i].node;
		if (p == i) {
			return i;
		}
		var r = this.check_inside(p);
		this.connect[i].node = r;
		return r;
	}
	this.connect_edges = function (i, k) {
		var first = this.check_inside(i);
		var second = this.check_inside(k);
		this.connect[first].node = second;
	}
}
//contains function to draw walls
function wall(i, j, k, l, cell_size) {
	this.i = i;
	this.j = j;
	this.cell_size = cell_size;

	this.k = k;
	this.l = l;
	this.isNeighbor = false;

	this.breaked = false;
	this.neighbor = function (isNeighbor) {
		this.isNeighbor = isNeighbor;
	}
	this.show = function () {
		if (this.breaked == false) {
			if (this.isNeighbor) {
				stroke(255, 0, 0);
				strokeWeight(4);
			} else {
				stroke(0);
				strokeWeight(2);
			}
			//draw the line
			line(this.j * this.cell_size, this.i * this.cell_size, this.l * this.cell_size, this.k * cell_size);
		}
	}
}