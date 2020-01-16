const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");


// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
	apiKey: '### FIREBASE API KEY ###',
	authDomain: '### FIREBASE AUTH DOMAIN ###',
	projectId: '### CLOUD FIRESTORE PROJECT ID ###'
  });
  
  var db = firebase.firestore();


var fuckingdiex,fuckingdiey;
//what will be stored in collections
db.collection("docData.mazes").document('maze').set({docData})
.then(function(docRef) {
    console.log("Document written with ID: ", docRef.id);
})
.catch(function(error) {
    console.error("Error adding document: ", error);
});

var state=1;
// state=1  pick level
// state=2  generation of level
// state=2.5 edit
// state=3  pick starting position
// state=4  calculate BFS
// state=5  display the solution/path   or no solution
var docData ={
	 maze: maze = [[]],
}
// wall=0;
// up=1;
// right=2;
// down=3;
// left=4;
var direction = [[]];

var maze_selection_gridy = [10,30,100,250];
var maze_selection_gridx = [20,60,200,500];
var maze_selection_prob = [0.5,0.5,0.65,0.7];
var random_maze_empty_prob;
var mazeysize;
var mazexsize;
var maze_selection_button_count=maze_selection_button_count;
var size=50; // auto calculated later
 

var queue = [];
var steps = 0;
var pre = [];
var finalx;
var finaly;
var buttonx=250, buttony=250, buttonsizex=200, buttonsizey=50;


var randomseed=1;
function erik_random(){
	var x = Math.sin(randomseed++)*10000;
	return x - Math.floor(x);	
}
// Color can be "red"  "#f01020"
function setColor(color){  
	context.fillStyle=color;
}
function drawText(text,x,y){
   context.fillText(text,x,y);
}

function update() {}

function drawmaze(){
	var x=0;
	var y=0;
	for(x=0; x<mazexsize; x++){
		for(y=0; y<mazeysize; y++){
			if(docData.maze[y][x]==' ' || docData.maze[y][x]=='b'){
				setColor('gray');
			}
			if(docData.maze[y][x]=='s'){
				setColor('lime');
			}
			if(docData.maze[y][x]=='*'){
				setColor('red');
			}
			if(docData.maze[y][x]=='p'){
				setColor('blue');
			}
			context.fillRect(x*size, y*size, size-1, size-1);
		}
	}
}
function draw() {
	if(state==1){
		for(var y=0; y<maze_selection_button_count; y++){
			setColor("grey");
			createbutton(buttonx,buttony+y*buttonsizey,buttonsizex,buttonsizey*0.9);
			fontheight=buttonsizey*0.5;
			context.font = "" + fontheight + "px Arial";
			setColor("black");
			drawText("size " + docData.maze_selection_gridx[y] + "x" +maze_selection_gridy[y] ,buttonx,buttony+y*buttonsizey+fontheight+(buttonsizey-fontheight)/2);
		}
	}
	if(state==2){	
		generatemaze();
	}
	if(state==2.5){
		drawmaze();
	}
	if(state==3){
		drawmaze();
	}
	if(state==4){
		drawmaze();
		//drawText("Loading...",300,300);
	}
	if(state==5){
		drawmaze();
	}
	if(state==6){
		drawmaze();
	}
	if(state==7){
		drawmaze();
	}
}

function keyup(key) {
	if(state==2.5){
		if(key==65){
			state=3;
		}
		if(key==66){
			var tosave = maze_to_string();
			window.localStorage.removeItem('maze');
			window.localStorage.setItem('maze',tosave);
			console.log(tosave);
		}
		if(key==76){
			var tosave = window.localStorage.getItem('maze');
			console.log(tosave);
			string_to_maze(tosave);
		}
	}
}
function mouseup() {
	
	if(state==1){
		if(mouseX>=buttonx && mouseY>=buttony && mouseX<=buttonx+buttonsizex && mouseY<=buttony+buttonsizey*maze_selection_button_count){
			var button_pressed = Math.floor((mouseY-buttony)/buttonsizey);
			mazexsize=docData.maze_selection_gridx[button_pressed];
			mazeysize=maze_selection_gridy[button_pressed];
			size=Math.floor(1000/mazexsize);
			docData.maze = new Array(mazeysize).fill(' ').map( () => new Array(mazexsize).fill(' '));
			direction = new Array(mazeysize).fill(0).map( () => new Array(mazexsize).fill(0));
			random_docData.maze_empty_prob = maze_selection_prob[button_pressed];
			state=2.5;
		}
	}
	if(state==2.5){
		var currX, currY;
		currX=Math.floor(mouseX/size);
		currY=Math.floor(mouseY/size);
		if(docData.maze[currY][currX]===' '){
			docData.maze[currY][currX]='*';
		}else{
			docData.maze[currY][currX]=' ';
		}
	}
	if(state==3 || state==5){
		var curX, curY,clean=0;
		curX=Math.floor(mouseX/size);
		curY=Math.floor(mouseY/size);
		if(docData.maze[curY][curX]!='*'){
			if(state==5){
				var x,y;
				for(x=0; x<mazexsize; x++){
					for(y=0; y<mazeysize; y++){
						if(docData.maze[y][x]=='s') { docData.maze[y][x]=' '; clean++;}
						if(docData.maze[y][x]=='p') { docData.maze[y][x]=' '; clean++;}
						if(docData.maze[y][x]=='b') { docData.maze[y][x]=' '; clean++;}
					}
				}		
				direction=new Array(mazeysize).fill(0).map( () => new Array(mazexsize).fill(0));				
			}
			state=4;
			docData.maze[curY][curX]='s';
			queue=[];
			queue.push({y:curY,x:curX});
			console.log("Start new docData.maze " + curY + " " + curX+ " " +clean);
			bfs();
		}
	}	
	
}
function generatemaze(){
	for(var y=0;y<mazeysize;y++){
		for(var x=0;x<mazexsize;x++){
			//console.log('im in');
			if(false/*erik_random()>=random_docData.maze_empty_prob*/){
				docData.maze[y][x]='*';
			}else{
				docData.maze[y][x]=' ';
			}
		}
	}
	state=2.5;
	return;
}

function createbutton(bx,by,bl,bw){
	context.fillRect(bx,by,bl,bw);
}
function maze_to_string(){
	let res='';
	res+=mazexsize.toString().padStart(4,'0');
	res+=mazeysize.toString().padStart(4,'0');
	for(let i=0;i<mazeysize;i++){
		for(let j=0;j<mazexsize;j++){
			res+=docData.maze[i][j];
		}
	}
	console.log(res);
	return res;
}

function string_to_maze(mazeasstring){
	console.log("string 2 maze ", mazeasstring);
	mazexsize=Number(mazeasstring.substring(0,4));
	mazeysize=Number(mazeasstring.substring(4,8));
	console.log("sizes:",mazexsize,mazeysize);
	// assert that the string length is correct ()
	for(let y=0;y<mazeysize;y++){
		for(let x=0;x<mazexsize;x++){
			docData.maze[y][x]=mazeasstring[8+x+y*mazexsize];
			console.log(docData.maze[y][x]);
		}
	}
	return;
}
function bfs(){
    while(queue.length>0 && state==4){
		var pos = queue.shift();
		console.log('bfs ',pos.y ,' ', pos.x, ' ', direction[pos.y][pos.x]," qlen:",queue.length);
		tryPos(pos.x+1, pos.y,4);
        tryPos(pos.x-1, pos.y,2);
        tryPos(pos.x, pos.y+1,1);
        tryPos(pos.x, pos.y-1,3);
	}
	// ??? handle case with no solution
	if(queue.length==0 && state==4){
		state=5;
		finalx=0; finaly=0;
		alert("NO SOLUTON FOUND");
	}else{
		findpath();
	}
}
function tryPos(cx,cy,cdirection){
	console.log('trypos: ',cy, ' ',cx,' ', cdirection,' :', docData.maze[cy][cx]);
    if(cy<mazeysize && cy>=0 && cx<mazexsize && cx>=0){
		if(docData.maze[cy][cx]===' '){
			if(cy==mazeysize-1 || cy==0 || cx==mazexsize-1 || cx==0){
				state=5;
				finalx=cx;
				finaly=cy;				
			}else{
				queue.push({x:cx, y:cy});
			}
			docData.maze[cy][cx]='b';
			direction[cy][cx]=cdirection;
		}
	}
    return;
}
function findpath(){
	console.log('in findpath ',finalx,' ',finaly,' ',direction[finaly][finalx],' ',docData.maze[finaly][finalx]);
	if(docData.maze[finaly][finalx]==='s'){
		return;
	}
	if(direction[finaly][finalx]===1){
		docData.maze[finaly][finalx]='p';
		finaly--;
		findpath();		
	}
	if(direction[finaly][finalx]===2){
		docData.maze[finaly][finalx]='p';
		finalx++;
		findpath();		
	}
	if(direction[finaly][finalx]===3){
		docData.maze[finaly][finalx]='p';
		finaly++;
		findpath();		
	}
	if(direction[finaly][finalx]===4){
		docData.maze[finaly][finalx]='p';
		finalx--;
		findpath();		
	}
	return;
}
