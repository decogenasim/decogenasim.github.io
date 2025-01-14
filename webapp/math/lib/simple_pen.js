"use strict"

function SimplePen(canvasId, lineWidth = 8, lineColor = 'black', bgColor = 'white'){
    this.debug      = false;
    this.printLog('construct simple pen');
    this.canvasId   = canvasId;
    this.canvas     = document.getElementById(this.canvasId);
    this.context    = null;
    this.penX       = 0;
    this.penY       = 0;
    this.isPenDown  = false;
    this.lineWidth  = lineWidth;
    this.strokeStyle = lineColor;
    this.bgColor    = bgColor;
    this.callbackFunc  = null;
    if(this.canvas){
        this.context = this.canvas.getContext('2d');
        this.context.lineCap = 'round';
        this.context.lineWidth = this.lineWidth;
        this.context.strokeStyle = this.strokeStyle;

        this.canvas.addEventListener('mousedown', event => {
            this.callbackPenDown(event.offsetX, event.offsetY);
        });
        this.canvas.addEventListener('mousemove', event => {
            this.callbackDrawLine(event.offsetX, event.offsetY);
        });
        this.canvas.addEventListener('mouseup', event => {
            this.callbackPenUp(event.offsetX, event.offsetY);
        });
        this.canvas.addEventListener('mouseout', event => {
            this.callbackPenUp(event.offsetX, event.offsetY);
        });

        this.canvas.addEventListener('touchstart', event => {
            const x = event.touches[0].clientX - this.canvas.getBoundingClientRect().left;
            const y = event.touches[0].clientY - this.canvas.getBoundingClientRect().top;
            this.callbackPenDown(x, y);
            event.preventDefault();
            event.stopPropagation();
        });
        this.canvas.addEventListener('touchmove', event => {
            const x = event.touches[0].clientX - this.canvas.getBoundingClientRect().left;
            const y = event.touches[0].clientY - this.canvas.getBoundingClientRect().top;
            this.callbackDrawLine(x, y);
            event.stopPropagation();
        });
        this.canvas.addEventListener('touchend', event => {
            const x = event.touches[0].clientX - this.canvas.getBoundingClientRect().left;
            const y = event.touches[0].clientY - this.canvas.getBoundingClientRect().top;
            this.callbackPenUp(x, y);
            event.stopPropagation();
        });
    }
    this.clearCanvas();
}

SimplePen.prototype.printLog = function(...args){
    if(this.debug == true){
        let buffer = '';
        for(let v of args){
            buffer += ' ' + String(v);
        }
        console.log(buffer);
    }
}

SimplePen.prototype.setCallbackOnPenUp = function(func){
    this.printLog('setCallbackOnPenUp');
    this.callbackFunc  = func;
}

SimplePen.prototype.callbackPenDown = function(newX, newY){
    this.isPenDown  = true;
    [this.penX, this.penY] = [newX, newY];
    this.printLog('pen_down:', this.isPenDown, ':X:', newX, ':Y:', newY);
}

SimplePen.prototype.callbackPenUp = function(func){
    this.printLog('pen_up:', this.isPenDown);
    if((this.isPenDown == true)&&(this.callbackFunc != null)){
        this.printLog('call callbackFunc');
        this.callbackFunc();
    }
    this.isPenDown  = false;
}

SimplePen.prototype.callbackDrawLine = function(newX, newY){
    this.printLog('pen_move:', this.isPenDown, ':X:', newX, ':Y:', newY);
    if(this.isPenDown == true){
        this.context.beginPath();
        this.context.moveTo(this.penX, this.penY);
        this.context.lineTo(newX, newY);
        this.context.stroke();
        [this.penX, this.penY] = [newX, newY];
        
    }
}

SimplePen.prototype.clearCanvas = function(){
    this.printLog('clear canvas');
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = this.bgColor;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
}


