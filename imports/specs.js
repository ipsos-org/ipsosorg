const specs = {
    attack: function(val, min, max){
        return (val - min) / (max - min);
    },
    decay: function(val, min, max){
        return (val - min) / (max - min) * 10;
    },
    sustain: function(val, min, max){
        return (val - min) / (max - min);
    },
    release: function(val, min, max){
        return (val - min) / (max - min);
    },
    voice_one: function(val, min, max){
        return (val - min) * (max - min) * 1220.0;
    },
    voice_two: function(val, min, max){
        return (val - min) * (max - min) * 1220.0;
    },
    voice_three: function(val, min, max){
        return (val - min) * (max - min) * 1220.0;
    },
    voice_four: function(val, min, max){
        return (val - min) * (max - min) * 1220.0;
    },
    detune: function(val, min, max){
        return (val - min) * (max - min) * 1000;
    }
};

export default specs;
