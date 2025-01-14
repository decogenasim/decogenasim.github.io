"use strict"

function WrittenDigitEstimator(){
    this.debug      = true;
    this.image      = null;
    this.binary     = null;
    this.binary_closing = null;
    this.labels     = null;
    this.numComponents = 0;
    this.areas      = [];
    this.areaParam  = {};
    this.predictModel = null;
}

WrittenDigitEstimator.prototype.destroy = function(){
    if(this.image){
        this.image.delete();
    }
    if(this.binary){
        this.binary.delete();
    }
    if(this.binary_closing){
        this.binary_closing.delete();
    }
    if(this.labels){
        this.labels.delete();
    }
}

WrittenDigitEstimator.prototype.setPredictModel = function(model){
    this.predictModel = model;
}

WrittenDigitEstimator.prototype.printLog = function(...args){
    if(this.debug == true){
        let buffer = '';
        for(let v of args){
            buffer += ' ' + String(v);
        }
        console.log(buffer);
    }
}


WrittenDigitEstimator.prototype.execCapture = function(canvasId){
    const canvas     = document.getElementById(canvasId);
    const context    = canvas.getContext('2d');
    const dummy = context.getImageData(0, 0, canvas.width, canvas.height);
    this.image = cv.matFromImageData(dummy);
}

WrittenDigitEstimator.prototype.execThreshHold = function(){
    //const src   = cv.matFromImageData(this.image);
    const gray  = new cv.Mat();
    this.binary = new cv.Mat();
    cv.cvtColor(this.image, gray, cv.COLOR_RGBA2GRAY);
    cv.threshold(gray, this.binary, 0, 255, cv.THRESH_BINARY_INV + cv.THRESH_OTSU);
    gray.delete();
}

WrittenDigitEstimator.prototype.execMorphology = function(k_rows, k_cols){
    this.binary_closing = new cv.Mat();
    const kernel = cv.Mat.ones(k_rows, k_cols, cv.CV_8UC1);
    cv.morphologyEx(this.binary, this.binary_closing, cv.MORPH_CLOSE, kernel);
    kernel.delete();
}

WrittenDigitEstimator.prototype.execConnectedComponents = function(){
    this.labels  = new cv.Mat();
    const stats  = new cv.Mat();
    const centroids  = new cv.Mat();
    this.numComponents = cv.connectedComponentsWithStats(this.binary_closing, this.labels, stats, centroids, 8, cv.CV_32S);
    stats.delete();
    centroids.delete();
    return this.numComponents;
}


WrittenDigitEstimator.prototype.analysisLabels = function(){
    if(this.numComponents < 2){
        return false;
    }
    this.areas = [];
    this.areaParam = {
        'hmax':0,
        'wmax':0,
        'hmin':Infinity,
        'wmin':Infinity,
        'area_max':0,
        'line_top':Infinity,
        'line_btm':0,
    };
    for(let n = 1; n < this.numComponents; n += 1){
        let sx = Infinity, sy = Infinity;
        let ex = 0, ey = 0;
        for(let i = 0; i < this.labels.data.length; i += 4){
            const x = Math.trunc(i/4) % this.labels.cols;
            const y = Math.trunc(Math.trunc(i/4) / this.labels.cols);
            if(this.labels.data[i] == n){
                if(x < sx) sx = x;
                if(y < sy) sy = y;
                if(x > ex) ex = x;
                if(y > ey) ey = y;
            }
        }
        const w = ex - sx, h = ey - sy;
        const area = Math.trunc(w*h);
        if(w  > this.areaParam.wmax) this.areaParam.wmax = w;
        if(h  > this.areaParam.hmax) this.areaParam.hmax = h;
        if(w  < this.areaParam.wmin) this.areaParam.wmin = w;
        if(h  < this.areaParam.hmin) this.areaParam.hmin = h;
        if(sy < this.areaParam.line_top) this.areaParam.line_top = sy;
        if(ey > this.areaParam.line_btm) this.areaParam.line_btm = ey;
        if(area > this.areaParam.area_max) this.areaParam.area_max = area;
        this.areas.push({
            id:n,
            sx:sx,
            sy:sy,
            ex:ex,
            ey:ey,
            area:area,
            w:w,
            h:h
        });
    }
    this.areaParam.line_center = Math.trunc((this.areaParam.line_btm + this.areaParam.line_top)/2);
    return true;
}

WrittenDigitEstimator.prototype.sortAreas = function(){
    this.areas.sort((a, b) => {return a.sx - b.sx});
}

WrittenDigitEstimator.prototype.estimateNoise = function(ptr){
    if((ptr.area < Math.trunc(this.areaParam.area_max * 0.2))&&
       ((ptr.sy > this.areaParam.line_center)||
       (ptr.ey < this.areaParam.line_center))){
        return true;
    }
    return false;
}

WrittenDigitEstimator.prototype.estimateDecimalPoint = function(ptr){
    if((ptr.area < Math.trunc(this.areaParam.area_max * 0.2))&&
       (ptr.sy > this.areaParam.line_center)){
        return true;
    }
    return false;
}

WrittenDigitEstimator.prototype.estimateSeparatedPart = function(ptr){
    if((ptr.sy > this.areaParam.line_center)||
       (ptr.ey < this.areaParam.line_center)){
        return true;
    }
    return false;
}
WrittenDigitEstimator.prototype.analysisAreas = function(){
    let i = 0;
    while(i < this.areas.length){
        const ptr = this.areas[i];
        ptr.est_noise = this.estimateNoise(ptr);
        ptr.est_dp = this.estimateDecimalPoint(ptr);
        ptr.est_sp = this.estimateSeparatedPart(ptr);
        console.log(ptr.id, 'noise:', ptr.est_noise);
        console.log(ptr.id, 'decimal point:', ptr.est_dp);
        console.log(ptr.id, 'separated part:', ptr.est_sp);
        i += 1;
    }
}

WrittenDigitEstimator.prototype.findMaxIndex = function(array){
    return array.reduce((maxIndex, currentValue, currentIndex) => {
        return currentValue > array[maxIndex] ? currentIndex : maxIndex;
    }, 0);
}

WrittenDigitEstimator.prototype.predictDigit = function(x, y, w, h, idx){
    let size = Math.trunc(w * 1.1);
    if(h > w) size = Math.trunc(h * 1.1);

    const gray = new cv.Mat(size, size, cv.CV_8UC1, new cv.Scalar(0));
    const offsetX = Math.trunc((size - w)/2);
    const offsetY = Math.trunc((size - h)/2);

    for(let i=0; i<this.labels.data.length; i+=4){
        const sx = Math.trunc(i/4) % this.labels.cols;
        const sy = Math.trunc(Math.trunc(i/4) / this.labels.cols);
        const xx = sx - x + offsetX;
        const yy = sy - y + offsetY;
        for(let j=0; j<idx.length; j+=1){
            if((this.labels.data[i] == idx[j]) &&
               ((0 <= xx) && (xx < size) &&
                (0 <= yy) && (yy < size))){
                gray.data[yy*size + xx] = 255; 
            }
        }
    }
    const dst = new cv.Mat();
    cv.resize(gray, dst, new cv.Size(28, 28), 0, 0, cv.INTER_LINEAR);
    let predict = false;
    if(this.predictModel != null){
        const pp = this.predictModel.predict(dst.data);
        if(pp != false){
            predict = this.findMaxIndex(pp);
        }
    }
    gray.delete();
    dst.delete();
    return predict;
}




