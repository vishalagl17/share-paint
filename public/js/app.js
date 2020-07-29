var socket = io();
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


//formatting variables
var lineWidth = "6";
var lineColor = "red";
var fillColor = "red";

//functionalities variables
var isDrawing = false;
var currentTool = "pencil";
var eraser = document.getElementById("eraser");


//utility variables
var stack = [];


// UI Variables
var current_tool_ui = document.getElementById("current_tool");
current_tool_ui.innerHTML = `Curren Tool: ${currentTool}`;

// Canvas events
canvas.addEventListener('mousedown',(e)=>{
    var x = e.clientX;
    var y = e.clientY;
    isDrawing = true;
    // console.log(x,y);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;
    ctx.fillStyle = fillColor;

    if(currentTool === "pencil"){
        ctx.beginPath();
        ctx.moveTo(x,y);
    }
    if(currentTool === "eraser"){
        eraser.style.top = `${y}px`;
        eraser.style.left = `${x}px`;
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.fillRect(x,y,10,10);
    }
    if(currentTool==="array"){
        ctx.beginPath();
        let tempx = x;
        let arrSize = Number(prompt("enter array size"));
        let w = Number(prompt("enter width"));
        let h = Number(prompt("enter height"));
        for(let i=1; i<=arrSize; i++){
            if(i===1){
                ctx.strokeRect(tempx,y,w,h);
                tempx+=w;
            }
            else {
                ctx.strokeRect(tempx,y,w,h);
                tempx+=w;
            }  
        }

        socket.emit('array',{x,y,arrSize,w,h});
    }

    if(currentTool==="text"){
        ctx.beginPath();
        ctx.font = "20px serif";
        let text = prompt("Enter text");
        ctx.fillText(text,x,y);
        socket.emit('text',{text,x,y});
    }

    socket.emit('mousedown',{x,y});
});



canvas.addEventListener('mousemove',(e)=>{
    var x = e.clientX;
    var y = e.clientY;
    if(isDrawing){
        if(currentTool === "pencil"){
                ctx.lineTo(x,y);
                ctx.stroke();
                stack.push({x,y}); //pushing the moving coordinates into stack
        }
        
        if(currentTool === "eraser"){
                // eraser.style.top = `${y}px`;
                //  eraser.style.left = `${x}px`;
                 ctx.fillStyle = "white";
                 ctx.fillRect(x,y,30,30);
                 stack.push({x,y}); //pushing the moing coordinates into stack
        }    
    }
});


canvas.addEventListener('mouseup',(e)=>{
    console.log("mouse up fired")
    isDrawing = false;
    socket.emit('mouseup',stack);
    stack = [];
});

document.addEventListener('keydown',(e)=>{
    socket.emit('keydown',e.key);
});




// Socket events 
socket.on('mousedown',(cords)=>{
    console.log("it fired");
    isDrawing = true;
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;
    ctx.fillStyle = fillColor;
    console.log(cords);
    if(currentTool === "pencil"){
        ctx.beginPath();
        ctx.moveTo(cords.x,cords.y);
    }
    if(currentTool === "eraser"){
        eraser.style.top = `${cords.y}px`;
        eraser.style.left = `${cords.x}px`;
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.fillRect(cords.x,cords.y,10,10);
    }
});

socket.on('array',(d)=>{
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;
    ctx.fillStyle = fillColor;
ctx.beginPath();
for(let i=1; i<=d.arrSize; i++){
    if(i===1){
        ctx.strokeRect(d.x,d.y,d.w,d.h);
        d.x+=d.w;
        console.log("run",d.x);
    }
    else {
        ctx.strokeRect(d.x,d.y,d.w,d.h);
        d.x+=d.w;
        console.log("run",d.x);
    }
}
});

socket.on('text',(d)=>{
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;
    ctx.fillStyle = fillColor;
    ctx.beginPath();
    ctx.font = "20px serif";
    ctx.fillText(d.text,d.x,d.y);  
});

socket.on('mouseup',(d)=>{
    console.log(d);
    if(d.length===0){return;}
    if(currentTool === "pencil"){
        for(let i=0; i<d.length; i++){
            ctx.lineTo(d[i].x,d[i].y);
            ctx.stroke();
        }
        isDrawing = false;
        stack = [];
    }
    
    if(currentTool === "eraser"){
        for(let i=0; i<d.length; i++){
            // eraser.style.top = `${d[i].y}px`;
            //  eraser.style.left = `${d[i].x}px`;
             ctx.fillStyle = "white";
             ctx.fillRect(d[i].x,d[i].y,30,30);
        }
        isDrawing = false;
        stack = [];
    }
});

socket.on('keydown',(key)=>{
    // eraser.style.display = "none";
    if(key === "c"){
        ctx.clearRect(canvas.getBoundingClientRect().x,canvas.getBoundingClientRect().y,canvas.width,canvas.height);
    }
    if(key === "e"){
        currentTool = "eraser";
        // eraser.style.display = "block";
        current_tool_ui.innerHTML = `Current Tool : ${currentTool}`;
    }
    if(key === "p"){
        currentTool = "pencil";
        current_tool_ui.innerHTML = `Current Tool : ${currentTool}`;
    }
    if(key === "a"){
        currentTool = "array";
        current_tool_ui.innerHTML = `Current Tool : ${currentTool}`;
    }
    if(key==="t"){
        currentTool = "text";
        current_tool_ui.innerHTML = `Current Tool : ${currentTool}`;
    }
});



