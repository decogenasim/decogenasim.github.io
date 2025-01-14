"use strict"

function PredictiveModel(){
    this.model = null;
}

PredictiveModel.prototype.setModel = function(model){
    this.model = model;
    console.log('set model:', this.model);
}
PredictiveModel.prototype.predict = function(image){
    console.log('predict', this);
    console.log('predict', this.model);
    //if(this.model == null){
        //return false;
    //}
    const score = tf.tidy(() => {
        let input = tf.tensor(image, [28, 28, 1]);
        input = tf.cast(input, 'float32').div(tf.scalar(255));
        input = input.expandDims();
        return this.model.predict(input).dataSync();
    });
    return score;
}

