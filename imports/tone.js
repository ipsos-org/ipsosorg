var Tone = require("Tone");
var distortion = new Tone.Distortion(0.6);
var tremolo = new Tone.Tremolo().start();
//var polySynth = new Tone.PolySynth(4, Tone.Synth).toMaster();
var polySynth = new Tone.PolySynth(4, Tone.Synth).chain(distortion, tremolo, Tone.Master);

export default polySynth;
