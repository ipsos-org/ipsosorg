function Scale (par, minVal, maxVal){
    this.minVal = minVal;
    this.maxVal = maxVal;
    this.clump = function(param, val, min, max){
        var result = (val - min) / (max - min);
        return param.push(result);
    };
};

export default Scale;
