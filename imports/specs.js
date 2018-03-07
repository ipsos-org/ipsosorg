const specs = {
    pt: function(val, outmin, outmax){
    	  inmin = 0.0;
      	inmax = 30.0;
        return (((val - inmin) / (inmax - inmin)) * (outmax - outmin)) + outmin;
    },
    eta: function(val, outmin, outmax){
    	  inmin = -5.0;
      	inmax = 5.0;
        return (((val - inmin) / (inmax - inmin)) * (outmax - outmin)) + outmin;
    },
    phi: function(val, outmin, outmax){
    	  inmin = -Math.PI;
      	inmax = Math.PI;
        return (((val - inmin) / (inmax - inmin)) * (outmax - outmin)) + outmin;
    },
    charge: function(val, outmin, outmax){
    	  inmin = -1;
      	inmax = 1;
        return (((val - inmin) / (inmax - inmin)) * (outmax - outmin)) + outmin;
    },

    attack: function(val, outmin, outmax){
    	  inmin = 0.001;
      	inmax = 1.0;
        return (((val - inmin) / (inmax - inmin)) * (outmax - outmin)) + outmin;
    },
    decay: function(val, outmin, outmax){
    	  inmin = 0.1;
      	inmax = 1.0;
        return (((val - inmin) / (inmax - inmin)) * (outmax - outmin)) + outmin;
    },
    sustain: function(val, outmin, outmax){
    	  inmin = 0.0;
      	inmax = 0.9;
        return (((val - inmin) / (inmax - inmin)) * (outmax - outmin)) + outmin;
    },
    release: function(val, outmin, outmax){
    	  inmin = 0.1;
      	inmax = 3.0;
        return (((val - inmin) / (inmax - inmin)) * (outmax - outmin)) + outmin;
    },
    detune: function(val, outmin, outmax){
    	  inmin = -Math.PI;
      	inmax = Math.PI;
        return (((val - inmin) / (inmax - inmin)) * (outmax - outmin)) + outmin;
    },
    frequency: function(val, outmin, outmax){
    	  inmin = 120.0;
      	inmax = 1220.0;
        return (((val - inmin) / (inmax - inmin)) * (outmax - outmin)) + outmin;
    },
};

export default specs;
