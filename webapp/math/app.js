
const READY_HTML = `
<div style="flex-flow:column;justify-content:center;">
<div>
<h1>READY</h1>
</div>
<div>
<button class="mybutton" id="_start_button">はじめる</button>
</div>
</div>
`;
const WORK_HTML = `
<div class="work_parent">
<div class="work_div01"><span id="work_math"></span></div>
<div class="work_div02"><canvas id="pen_canvas" width="210" height="120"></canvas></div>
<div class="work_div03">
<button class="mybutton" id="_clear_button" disabled>けす</button>
<button class="mybutton" id="_next_button" disabled>つぎ</button>
</div>
</div>
`;

const RESULT_HTML = `
<div class="result_parent">
<div class="result_div01"><span id="result_math_01"></span></div>
<div class="result_div02"><canvas id="result_canvas_01" width="70" height="40"></canvas></div>
<div class="result_div03"><span id="result_math_02"></span></div>
<div class="result_div04"><canvas id="result_canvas_02" width="70" height="40"></canvas></div>
<div class="result_div05"><span id="result_math_03"></span></div>
<div class="result_div06"><canvas id="result_canvas_03" width="70" height="40"></canvas></div>
<div class="result_div07"><span id="result_math_04"></span></div>
<div class="result_div08"><canvas id="result_canvas_04" width="70" height="40"></canvas></div>
<div class="result_div09"><span id="result_math_05"></span></div>
<div class="result_div10"><canvas id="result_canvas_05" width="70" height="40"></canvas></div>
<div class="result_div11"><span id="result_math_06"></span></div>
<div class="result_div12"><canvas id="result_canvas_06" width="70" height="40"></canvas></div>
<div class="result_div13"><span id="result_math_07"></span></div>
<div class="result_div14"><canvas id="result_canvas_07" width="70" height="40"></canvas></div>
<div class="result_div15"><span id="result_math_08"></span></div>
<div class="result_div16"><canvas id="result_canvas_08" width="70" height="40"></canvas></div>
<div class="result_div17"><span id="result_math_09"></span></div>
<div class="result_div18"><canvas id="result_canvas_09" width="70" height="40"></canvas></div>
<div class="result_div19"><span id="result_math_10"></span></div>
<div class="result_div20"><canvas id="result_canvas_10" width="70" height="40"></canvas></div>
</div>
`;


function app_main(){
    console.log('app_main();');
    FSM = new FiniteStateMachine({
        states:[
            {
                name: 'loading',
                enter_hook: undefined,
                exit_hook: undefined,
                effect: 'cover-down',
                trans_mode: 'in',
                trans_time: '1s',
                html: '<h1>loading</h1>',
                style: 'background-color: #fff',
            },
            {
                name: 'ready',
                enter_hook: undefined,
                exit_hook: undefined,
                effect: 'circle',
                trans_mode: 'out-in',
                trans_time: '0.5s',
                html: READY_HTML,
                style: 'background-color: #fff',
            },
            {
                name: 'work',
                enter_hook: undefined,
                exit_hook: undefined,
                effect: 'circle',
                trans_mode: 'out-in',
                trans_time: '0.5s',
                html: WORK_HTML,
                style: 'background-color: #fff',
            },
            {
                name: 'result',
                enter_hook: undefined,
                exit_hook: undefined,
                effect: 'circle',
                trans_mode: 'out-in',
                trans_time: '1s',
                html: RESULT_HTML,
                style: 'background-color: #fff',
            },
        ],
        initial: 'loading',
    });
}

function getUrlQueries(){
    const queryStr = window.location.search.slice(1);
    const queries  = {};
    if(queryStr){
        queryStr.split('&').forEach(function(queryStr) {
            const arg = queryStr.split('=');
            queries[arg[0]] = arg[1];
        });
    }
    console.log(queries);
    return queries;
}
//getUrlQueries();

/***
button
***/
function setButton(){
    document.getElementById('_start_button').addEventListener('click',function() {
        FSM.setTransState('work');
    });
    document.getElementById('_clear_button').addEventListener('click',function() {
        _SimplePen.clearCanvas();
    });
    document.getElementById('_next_button').addEventListener('click',function() {
        _prepareNext();
    });
}
/***
Simple Pen
***/
let _SimplePen = null;
function runSimplePen(){
    console.log('setSimplePen()');
    _SimplePen = new SimplePen('pen_canvas', 8, 'black', 'white');
}


/***
GAS.js
***/


let PractisPtr  = -1;
//let PractisList = null;

const GAS_URL = "https://script.google.com/macros/s/";
//AKfycbxLNoGBq4jVeN64Z_qdIhhVjvShbjg3r8u3JY7w0gU2r-7I4ETQYxQgivh7Cq53msjI/exec";
async function load_json(key){
    const url = GAS_URL + key + "/exec";
    console.log('load_json();', url);
    const req = fetch(url);
    const res = await req;
    PractisList = await res.json();
    await console.log(PractisList);
//    PractisPtr  = 0;
    await onLoaded('gas');
    document.getElementById('_clear_button').disabled = false;
    document.getElementById('_next_button').disabled = false;
}

/***
Katex
***/

function setWorkMath(){
    console.log('setWorkMath', PractisPtr);
    const e = document.getElementById('work_math');
    e.innerText = PractisList[PractisPtr].tex;
    katex.render(e.innerText, e, {});
    
}

function setResultMath(){
    for(let i=0; i<PractisList.length; i+=1){
        const tmp = "result_math_" + ('00' + (i+1)).slice(-2);
        console.log(tmp);
        const e = document.getElementById(tmp);
        e.innerText = PractisList[i].tex;
        katex.render(e.innerText, e, {});
    }
}


/***
tensor flow model
***/

async function runOpenCV(){
    window.cv = await window.cv;
    if(cv.getBuildInformation){
        //console.log(cv.getBuildInformation());
        //onLoadCvCallback();
    }else{
        // WASM
        cv['onRuntimeInitialized']=()=>{
            console.log(cv.getBuildInformation());
            //onLoadCvCallback();
        }
    }
}
let _Model = null;
async function loadPretrainedModel(){
    const pp = await tf.loadLayersModel('./lib/model.json');
    _Model = new PredictiveModel();
    _Model.setModel(pp);
}

async function execPredict(){
    console.log('execPredict():stack_len:', _ImageStack.length);
    for(let i=0; i<_ImageStack.length; i+=1){
        const ptr = _ImageStack[i];
        if(ptr.processing == false){
            const p = await imageProcessing(ptr.estimator);
            console.log(i, 'ans:', p);
            ptr.processing = true;
            ptr.predict = p;
            drawCheckOnResult(i);
        }
    }
}

async function imageProcessing(estimator){
return new Promise((resolve) => {
    estimator.execThreshHold();
    estimator.execMorphology(5, 5);
    const n = estimator.execConnectedComponents();
    estimator.analysisLabels();
    estimator.sortAreas();
    estimator.analysisAreas();
    let result = '';
    for(let i=0; i<n-1; i+=1){
        const p = estimator.areas[i];
        const predict = estimator.predictDigit(p.sx, p.sy, p.w, p.h, [p.id]);
        if(p.est_dp == true){
            result = result + ".";
        }else if(p.est_noise == false){
            const predict = estimator.predictDigit(p.sx, p.sy, p.w, p.h, [p.id]);
            result = result + predict;
        }
        //console.log('areas[',i,']:', predict);
        //console.log('areas[',i,']:', estimator.areas[i]);
    }
    resolve(result);
});
}


/***
Image Stack
***/
let _ImageStack = [];

function pushImageStack(){
    const estimator = new WrittenDigitEstimator();
    estimator.setPredictModel(_Model);
    estimator.execCapture('pen_canvas');
    _ImageStack.push({
        'estimator': estimator,
        'processing': false,
        'predict': '',
    });
    console.log('pushImageStack:stacked', _ImageStack.length);
}


/***
***/
function cpImageToResult(ptr){
    const img = _ImageStack[ptr];
    const tmp = "result_canvas_" + ('00' + (ptr+1)).slice(-2);
    const dst = new cv.Mat();
    cv.resize(img.estimator.image, dst, new cv.Size(70, 40), 0, 0, cv.INTER_LINEAR);
    cv.imshow(tmp, dst);
    dst.delete();
}
function drawCheckOnResult(ptr){
    const img = _ImageStack[ptr];
    const tmp = "result_canvas_" + ('00' + (ptr+1)).slice(-2);
    const ctx = document.getElementById(tmp).getContext('2d');
    console.log('collect:',img.predict, PractisList[ptr].collect);
    ctx.beginPath();
    if(img.predict == PractisList[ptr].collect){
        ctx.arc(20, 20, 15, 0, Math.PI*2);
    }else{
        ctx.moveTo(20, 30);
        ctx.lineTo(10, 20);
        ctx.moveTo(20, 30);
        ctx.lineTo(40, 10);
    }
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(255, 0, 0, 0.6)";
    ctx.stroke();
}
function _prepareNext(){
    if((PractisPtr >= 0)&&(PractisPtr < PractisList.length)){
        pushImageStack();
        cpImageToResult(PractisPtr);
    }
    PractisPtr = PractisPtr + 1;
    if(PractisPtr < PractisList.length){
        setWorkMath();
    }
    execPredict();
    if(PractisPtr  == PractisList.length){
        FSM.setTransState('result');
    }
    _SimplePen.clearCanvas();
}

function execPrepare(){
    PractisPtr  = -1;
    loadPretrainedModel();
    setButton();
    setResultMath();
    _prepareNext();
}
