const FSM_AnimationEffect = function (){
    const FunctionTable = [
        {
            'name': 'none',
            'func':{
            },
        },
        {
            'name': 'opacity',
            'func':{
                'in': startOpacityTransIn,
                'out': startOpacityTransOut,
                'out-in': startOpacityTransOutIn_Out,
            },
        },
        {
            'name': 'masking',
            'func':{
                'in': startMaskingTransIn,
                'out': startMaskingTransOut,
                'out-in': startMaskingTransOutIn_Out,
            },
        },
    ];
    const AnimationTable = [
        {
            'name': 'none',
            'method': 'none',
        },
        {
            'name': 'fade',
            'method': 'opacity',
            'animationNameIn': 'fade-in',
            'animationNameOut': 'fade-out',
            'opacityInStart': '0',
            'opacityInEnd': '1',
            'opacityOutStart': '1',
            'opacityOutEnd': '0',
        },
        {
            'name': 'cover-down',
            'method': 'masking',
            'animationNameIn': 'cover-down',
            'animationNameOut': 'uncover-down',
            'clipPathInStart': 'inset(0 0 100% 0)',
            'clipPathInEnd': 'inset(0)',
            'clipPathOutStart': 'inset(0)',
            'clipPathOutEnd': 'inset(100% 0 0 0)',
        },
        {
            'name': 'cover-up',
            'method': 'masking',
            'animationNameIn': 'cover-up',
            'animationNameOut': 'uncover-up',
            'clipPathInStart': 'inset(100% 0 0 0)',
            'clipPathInEnd': 'inset(0)',
            'clipPathOutStart': 'inset(0)',
            'clipPathOutEnd': 'inset(0 0 100% 0)',
        },
        {
            'name': 'cover-left',
            'method': 'masking',
            'animationNameIn': 'cover-left',
            'animationNameOut': 'uncover-left',
            'clipPathInStart': 'inset(0 0 0 100%)',
            'clipPathInEnd': 'inset(0)',
            'clipPathOutStart': 'inset(0)',
            'clipPathOutEnd': 'inset(0 100% 0 0)',
        },
        {
            'name': 'cover-right',
            'method': 'masking',
            'animationNameIn': 'cover-right',
            'animationNameOut': 'uncover-right',
            'clipPathInStart': 'inset(0 100% 0 0)',
            'clipPathInEnd': 'inset(0)',
            'clipPathOutStart': 'inset(0)',
            'clipPathOutEnd': 'inset(0 0 0 100%)',
        },
        {
            'name': 'circle',
            'method': 'masking',
            'animationNameIn': 'circle reverse',
            'animationNameOut': 'circle',
            'clipPathInStart': 'circle(0%)',
            'clipPathInEnd': 'circle(75%)',
            'clipPathOutStart': 'circle(75%)',
            'clipPathOutEnd': 'circle(0%)',
        },
        {
            'name': 'spiral',
            'method': 'masking',
            'transMode': ['in', 'out', 'out-in'],
            'animationNameIn': 'spiral reverse',
            'animationNameOut': 'spiral',
            'clipPathInStart': 'polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 25%, 0% 25%, 0% 25%, 0% 25%, 0% 25%, 0% 25%, 0% 25%)',
            'clipPathInEnd': 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 25%, 75% 25%, 75% 75%, 25% 75%, 25% 50%, 50% 50%, 25% 50%, 25% 75%, 75% 75%, 75% 25%, 0% 25%)',
            'clipPathOutStart': 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 25%, 75% 25%, 75% 75%, 25% 75%, 25% 50%, 50% 50%, 25% 50%, 25% 75%, 75% 75%, 75% 25%, 0% 25%)',
            'clipPathOutEnd': 'polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 25%, 0% 25%, 0% 25%, 0% 25%, 0% 25%, 0% 25%, 0% 25%)',
        },
        {
            'name': 'shutters',
            'method': 'masking',
            'animationNameIn': 'shutters reverse',
            'animationNameOut': 'shutters',
            'clipPathInStart': 'polygon(20% 0%, 20% 0%, 20% 100%, 40% 100%, 40% 0%, 40% 0%, 40% 100%, 60% 100%, 60% 0%, 60% 0%, 60% 100%, 80% 100%, 80% 0%, 80% 0%, 80% 100%, 100% 100%, 100% 0%, 100% 0%, 100% 100%, 20% 100%)',
            'clipPathInEnd': 'polygon(0% 0%, 20% 0%, 20% 100%, 20% 100%, 20% 0%, 40% 0%, 40% 100%, 40% 100%, 40% 0%, 60% 0%, 60% 100%, 60% 100%, 60% 0%, 80% 0%, 80% 100%, 80% 100%, 80% 0%, 100% 0%, 100% 100%, 0% 100%)',
            'clipPathOutStart': 'polygon(0% 0%, 20% 0%, 20% 100%, 20% 100%, 20% 0%, 40% 0%, 40% 100%, 40% 100%, 40% 0%, 60% 0%, 60% 100%, 60% 100%, 60% 0%, 80% 0%, 80% 100%, 80% 100%, 80% 0%, 100% 0%, 100% 100%, 0% 100%)',
            'clipPathOutEnd': 'polygon(20% 0%, 20% 0%, 20% 100%, 40% 100%, 40% 0%, 40% 0%, 40% 100%, 60% 100%, 60% 0%, 60% 0%, 60% 100%, 80% 100%, 80% 0%, 80% 0%, 80% 100%, 100% 100%, 100% 0%, 100% 0%, 100% 100%, 20% 100%)',
        },
    ];
    let TransExit_CB = undefined;
    let FromElem = undefined;
    let ToElem = undefined;
    let BackElem = undefined;

    let EffectName = undefined;
    let ModeName = undefined;
    let Duration = '1s';
    let ActiveLayerZindex = 0;
    let NextLayerZindex = 0;
    let BackLayerZindex = 0;
///
/// Private Function
///
    function _getEffectByName(effect){
        for(let i = 0; i < AnimationTable.length; i+=1){
            if(AnimationTable[i].name === effect){
                return AnimationTable[i];
            }
        }
        return undefined;
    }
    function _getMethod(method, mode){
        console.log(method, mode);
        for(let i = 0; i < FunctionTable.length; i+=1){
            //console.log(FunctionTable[i]);
            if(FunctionTable[i].name === method){
                console.log(FunctionTable[i].name);
                if(mode in FunctionTable[i].func){
                    return FunctionTable[i].func[mode];
                }
            }
        }
        return undefined;
    }
    function _exexTransStart(){
        const eff = _getEffectByName(EffectName);
        const f = _getMethod(eff.method, ModeName);
        if(f !== undefined){
            f();
        }else{
        }
    }
    function _initLayer(){
        FromElem.style.zIndex = ActiveLayerZindex;
        ToElem.style.zIndex = NextLayerZindex;
        BackElem.style.zIndex = BackLayerZindex;
    }
    function _toggleLayer(){
        ToElem.style.zIndex = ActiveLayerZindex;
        FromElem.style.zIndex = NextLayerZindex;
    }
    function _callExitCB(){
        console.log('called _callExitCB');
        if(TransExit_CB !== undefined){
            TransExit_CB.exitEffect();
        }
    }
    function startOpacityTransIn(){
        console.log('Start Trans Opacity In');
        const eff = _getEffectByName(EffectName);
        _initLayer();
        ToElem.style.opacity = eff.opacityInStart;
        _toggleLayer();
        ToElem.style.animation = Duration + ' ' + eff.animationNameIn;
        ToElem.style.animationFillMode = 'forward';
        ToElem.addEventListener('animationend', execEndOpacityTransIn);
    }
    function execEndOpacityTransIn(e){
        console.log('animationend:In', FromElem.id, ToElem.id);
        const eff = _getEffectByName(EffectName);
        ToElem.style.opacity = eff.opacityInEnd;
        ToElem.style.animation = '';
        ToElem.removeEventListener('animationend', execEndOpacityTransIn);
        _callExitCB();
    }
    function startOpacityTransOut(){
        console.log('Start Trans Opacity Out');
        const eff = _getEffectByName(EffectName);
        _initLayer();
        FromElem.style.opacity = eff.opacityOutStart;
        FromElem.style.animation = Duration + ' ' + eff.animationNameOut;
        FromElem.style.animationFillMode = 'forward';
        FromElem.addEventListener('animationend', execEndOpacityTransOut);
    }
    function execEndOpacityTransOut(e){
        console.log('animationend:Out', FromElem.id, ToElem.id);
        const eff = _getEffectByName(EffectName);
        _toggleLayer();
        FromElem.style.opacity = eff.opacityOutEnd;
        FromElem.style.animation = '';
        FromElem.removeEventListener('animationend', execEndOpacityTransOut);
        _callExitCB();
    }
    function startOpacityTransOutIn_Out(){
        console.log('Start Trans Opacity OutIn');
        const eff = _getEffectByName(EffectName);
        _initLayer();
        FromElem.style.opacity = eff.opacityOutStart;
        ToElem.style.opacity = eff.opacityInStart;
        FromElem.style.animation = Duration + ' ' + eff.animationNameOut;
        FromElem.style.animationFillMode = 'forward';
        FromElem.addEventListener('animationend', execEndOpacityTransOutIn_Out);
    }
    function execEndOpacityTransOutIn_Out(e){
        console.log('animationend:Out', FromElem.id, ToElem.id);
        const eff = _getEffectByName(EffectName);
        FromElem.style.opacity = eff.opacityOutEnd;
        FromElem.style.animation = '';
        FromElem.removeEventListener('animationend', execEndOpacityTransOutIn_Out);
        _toggleLayer();
        ToElem.style.animation = Duration + ' ' + eff.animationNameIn;
        ToElem.style.animationFillMode = 'forward';
        ToElem.addEventListener('animationend', execEndOpacityTransOutIn_In);
    }
    function execEndOpacityTransOutIn_In(e){
        console.log('animationend:In', FromElem.id, ToElem.id);
        const eff = _getEffectByName(EffectName);
        ToElem.style.opacity = eff.opacityInEnd;
        ToElem.style.animation = '';
        ToElem.removeEventListener('animationend', execEndOpacityTransOutIn_In);
        _callExitCB();
    }
    function startMaskingTransIn(){
        console.log('Start Trans Making In');
        const eff = _getEffectByName(EffectName);
        _initLayer();
        ToElem.style.clipPath = eff.clipPathInStart;
        _toggleLayer();
        ToElem.style.animation = Duration + ' ' + eff.animationNameIn;
        ToElem.style.animationFillMode = 'forward';
        ToElem.addEventListener('animationend', execEndMaskingTransIn);
    }
    function execEndMaskingTransIn(e){
        console.log('animationend:In', FromElem.id, ToElem.id);
        const eff = _getEffectByName(EffectName);
        ToElem.style.clipPath = eff.clipPathInEnd;
        ToElem.style.animation = '';
        ToElem.removeEventListener('animationend', execEndMaskingTransIn);
        _callExitCB();
    }
    function startMaskingTransOut(){
        console.log('Start Trans Opacity Out');
        const eff = _getEffectByName(EffectName);
        _initLayer();
        FromElem.style.clipPath = eff.clipPathOutStart;
        FromElem.style.animation = Duration + ' ' + eff.animationNameOut;
        FromElem.style.animationFillMode = 'forward';
        FromElem.addEventListener('animationend', execEndMaskingTransOut);
    }
    function execEndMaskingTransOut(e){
        console.log('animationend:Out', FromElem.id, ToElem.id);
        const eff = _getEffectByName(EffectName);
        _toggleLayer();
        FromElem.style.clipPath = eff.clipPathOutEnd;
        FromElem.style.animation = '';
        FromElem.removeEventListener('animationend', execEndMaskingTransOut);
        _callExitCB();
    }
    function startMaskingTransOutIn_Out(){
        console.log('Start Trans Masking OutIn');
        const eff = _getEffectByName(EffectName);
        _initLayer();
        FromElem.style.clipPath = eff.clipPathOutStart;
        ToElem.style.clipPath = eff.clipPathInStart;
        FromElem.style.animation = Duration + ' ' + eff.animationNameOut;
        FromElem.style.animationFillMode = 'forward';
        FromElem.addEventListener('animationend', execEndMaskingTransOutIn_Out);
    }
    function execEndMaskingTransOutIn_Out(e){
        console.log('animationend:Out', FromElem.id, ToElem.id);
        const eff = _getEffectByName(EffectName);
        FromElem.style.clipPath = eff.clipPathOutEnd;
        FromElem.style.animation = '';
        FromElem.removeEventListener('animationend', execEndMaskingTransOutIn_Out);
        _toggleLayer();
        ToElem.style.animation = Duration + ' ' + eff.animationNameIn;
        ToElem.style.animationFillMode = 'forward';
        ToElem.addEventListener('animationend', execEndMaskingTransOutIn_In);
    }
    function execEndMaskingTransOutIn_In(e){
        console.log('animationend:In', FromElem.id, ToElem.id);
        const eff = _getEffectByName(EffectName);
        ToElem.style.clipPath = eff.clipPathInEnd;
        ToElem.style.animation = '';
        ToElem.removeEventListener('animationend', execEndMaskingTransOutIn_In);
        _callExitCB();
    }
///
/// Method
///
    this.setBackElem = function(back){
        BackElem = back;
    }
    this.setTransParam = function(from, to, effect, mode, duration){
        FromElem = from;
        ToElem = to;
        EffectName = effect;
        ModeName = mode;
        Duration = duration;
    }
    this.setLayerZindex = function(activeLayer, nextLayer, backLayer){
        ActiveLayerZindex = activeLayer;
        NextLayerZindex = nextLayer;
        BackLayerZindex = backLayer;
    }
    this.setEffectExitObj = function(obj){
        TransExit_CB = obj;
    }
    this.isExistsEffect = function(effect, trans_mode){
        const e = _getEffectByName(effect);
        if(e !== undefined){
            if(_getMethod(e.method, trans_mode) !== undefined){
                return true;
            }
        }
        return false;
    }
    this.getEffectModeList = function(effect){
        const e = _getEffectByName(effect);
        if(e !== undefined){
        }
        return [];
    }
    this.startTransition = function(){
        _exexTransStart();
    }
}

const FiniteStateMachine = function (option){
    const Version = 'ver 0.0.2';
    let Error = false;
    let ExecTrans = false;
    let CurrentState = undefined;
    let BackGroundColor = '#ccc';
    const StatesTable = [];
    const ZindexDefault = 1;
    const ZindexActive  = 300;
    const ZindexNext    = 200;
    const ZindexBack    = 100;

    const TransStateQueue = [];
    let ActiveState = undefined;
    let NextState = undefined;
    const TransitEffect = new FSM_AnimationEffect();
    if(!(option instanceof Object && !(option instanceof Array))){
        option = {};
    }

    if(option.states){
        option.states.map(function(item, i){
            if(item.name != undefined){
                let effect = 'none';
                let trans_mode = 'none';
                let trans_time = '1s';
                if((item.effect !== 'none')&&(item.trans_mode !== 'none')){
                    if(TransitEffect.isExistsEffect(item.effect, item.trans_mode)){
                        effect = item.effect;
                        trans_mode = item.trans_mode;
                    }else{
                        console.warn(' no effect', item.effect, '(', item.name, ')');
                    }
                }
                if(item.trans_time !== undefined){
                    trans_time = item.trans_time;
                }
                let chunk = {
                    id: i,
                    name: item.name,
                    enter_hook: item.enter_hook,
                    exit_hook: item.exit_hook,
                    effect: effect,
                    trans_mode: trans_mode,
                    trans_time: item.trans_time,
                    html: item.html,
                    style: item.style,
                    dom: undefined,
                    dom_id: undefined,
                }; 
                StatesTable.push(chunk);
            }else{
                Error = true;
                console.error('Initialize State, but index:', i, 'name undefined');
            }
        });
    }else{
        Error = true;
        console.error('No find states define');
    }
    if(Error != true){
        for(let i = 0; i < StatesTable.length; i+=1){
            _initStateHtmlElement(StatesTable[i]);
        }
        if(option.background_color){
            BackGroundColor = option.background_color;
        }
        _initBackground();
        TransitEffect.setLayerZindex(ZindexActive, ZindexNext, ZindexBack);
        TransitEffect.setEffectExitObj(this);

    }
    if(option.initial){
        if(_isExistsState(option.initial)){
            _setActiveLayer(option.initial);
        }else{
            console.error(option.initial, ' is not found states table');
        }
    }else{
        Error = true;
        console.error('No find initial state define');
    }
///
/// Private Function
///
    function _initBackground(){
        console.log('_initBackground', BackGroundColor);
        const dom = document.createElement('div');
        const idx = 's_back';
        dom.setAttribute('id', idx);
        dom.classList.add('fsm_page');
        dom.style.backgroundColor = BackGroundColor;
        dom.style.zIndex = ZindexBack;
        document.getElementById('fms_container').appendChild(dom);
        TransitEffect.setBackElem(dom);
    }
    function _initStateHtmlElement(state){
        console.log('_initStateHtmlElemen:', state.id, state.name);
        const dom = document.createElement('div');
        const idx = 's_' + state.id + '_' + state.name;
        dom.setAttribute('id', idx);
        dom.classList.add('fsm_page');
        if(state.html !== undefined){
            dom.innerHTML = state.html;
        }
        if(state.style !== undefined){
            dom.style = state.style;
        }
        dom.style.zIndex = ZindexDefault;
        document.getElementById('fms_container').appendChild(dom);
        state.dom = dom;
        state.dom_id = idx;
    }
    function _getStateParam(name){
        for(let i = 0; i < StatesTable.length; i+=1){
            if(StatesTable[i].name === name){
                return StatesTable[i];
            }
        }
        return undefined;
    }
    function _getStateElement(name){
        const param = _getStateParam(name);
        if(param !== undefined){
            return param.dom;
        }
        return undefined;
    }
    function _setActiveLayer(name){
        const param = _getStateParam(name);
        if(param !== undefined){
            //if((ActiveState !== undefined)||(ActiveState.dom !== undefined)){
            if(ActiveState !== undefined){
                console.log(ActiveState.name);
                console.log(ActiveState.dom.style);
                ActiveState.dom.style.zIndex = ZindexDefault;
            }
            CurrentState = param.name;
            ActiveState = param;
            param.dom.style.zIndex = ZindexActive;
        }
    }
    function _isExistsState(name){
        for(let i = 0; i < StatesTable.length; i+=1){
            if(StatesTable[i].name === name){
                return true;
            }
        }
        return false;
    }
    function _execTransState(){
        if((ExecTrans == true)||(TransStateQueue.length < 1)){
            console.log('debug 1');
            return;
        }
        const nextName = TransStateQueue.shift();
        if(nextName === CurrentState){
            console.log('debug 2');
            return;
        }
        const param = _getStateParam(nextName);
        if(param === undefined){
            console.log('debug 3');
            return;
        }
        ExecTrans = true;
        NextState = param;
        console.log('_execTransState:', ActiveState.name, '=>', NextState.name);
        TransitEffect.setTransParam(ActiveState.dom, NextState.dom, param.effect, param.trans_mode, param.trans_time);
        TransitEffect.startTransition();
    }
    function _exitEffect(){
        console.log('called _exitTransState()');
        if(ActiveState.exit_hook !== undefined){
            ActiveState.exit_hook();
        }
        _setActiveLayer(NextState.name);
        if(ActiveState.enter_hook !== undefined){
            ActiveState.enter_hook();
        }
        NextElement = undefined;
        ExecTrans = false;
        console.log('current', CurrentState);
        if(0 < TransStateQueue.length){
            _execTransState();
        }
    }
    function _setTransStateQueue(statename){
        console.log('setTransStateQueue:', statename);
        TransStateQueue.push(statename);
        if(TransStateQueue.length == 1){
            _execTransState();
        }
    }
///
/// Method
///
    this.getVersion = function(){
        return Version;
    }
    this.getCurrentState = function(){
        return CurrentState;
    }
    this.isExistsState = function(statename){
        return _isExistsState(statename);
    }
    this.setTransState = function(statename){
        return _setTransStateQueue(statename);
    }
    this.printStatesTable = function(){
        console.table(StatesTable);
    }
    this.printTransStateQueue = function(){
        console.table(TransStateQueue);
    }
    this.exitEffect = function(){
        _exitEffect();
    }
};
