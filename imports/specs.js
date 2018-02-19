const specs = {
    attack: function(val, outmin, outmax){
    	  inmin = -Math.PI;
      	inmax = Math.PI;
        //return console.log((Math.min(outmax, Math.max(outmin, val))));
        return (((val - inmin) / (inmax - inmin)) * (outmax - outmin)) + outmin;
    },
    decay: function(val, outmin, outmax){
    	  inmin = -Math.PI;
      	inmax = Math.PI;
        return (((val - inmin) / (inmax - inmin)) * (outmax - outmin)) + outmin;
    },
    sustain:function(val, outmin, outmax){
    	  inmin = -Math.PI;
      	inmax = Math.PI;
        return (((val - inmin) / (inmax - inmin)) * (outmax - outmin)) + outmin;
    }	,
    release: function(val, outmin, outmax){
    	  inmin = -Math.PI;
      	inmax = Math.PI;
        return (((val - inmin) / (inmax - inmin)) * (outmax - outmin)) + outmin;
    },
    voice_one: function(val, outmin, outmax){
    	  inmin = -Math.PI;
      	inmax = Math.PI;
        return (((val - inmin) / (inmax - inmin)) * (outmax - outmin)) + outmin;
    },
    voice_two: function(val, outmin, outmax){
    	  inmin = -Math.PI;
      	inmax = Math.PI;
        return (((val - inmin) / (inmax - inmin)) * (outmax - outmin)) + outmin;
    },
    voice_three: function(val, outmin, outmax){
    	  inmin = -Math.PI;
      	inmax = Math.PI;
        return (((val - inmin) / (inmax - inmin)) * (outmax - outmin)) + outmin;
    },
    voice_four: function(val, outmin, outmax){
    	  inmin = -Math.PI;
      	inmax = Math.PI;
        return (((val - inmin) / (inmax - inmin)) * (outmax - outmin)) + outmin;
    },
    detune: function(val, outmin, outmax){
    	  inmin = -Math.PI;
      	inmax = Math.PI;
        return (((val - inmin) / (inmax - inmin)) * (outmax - outmin)) + outmin;
    }
};

export default specs;
