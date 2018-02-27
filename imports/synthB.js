var Tone = require("Tone");

var synthB = new Tone.Synth({
	  oscillator : {
  	    type : 'triangle8'
    },
    envelope : {
  	    attack : 2,
        decay : 1,
        sustain: 0.4,
        release: 4
    }
}).toMaster();

export default synthB;
