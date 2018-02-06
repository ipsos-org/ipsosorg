let scaleValue = require('scale-value');

const specs = {
    attack: scaleValue(0, 1, 0.001, 0.99),
    decay: scaleValue(0, 1, 0.1, 2.0),
    sustain: scaleValue(0, 1, 0.1, 1.0),
    release: scaleValue(0, 1, 0.1, 1.0),
    gain: scaleValue(0, 1, 0.1, 0.1),
    modulationIndex: scaleValue(0, 1, 1.0, 20.0),
    detune: scaleValue(0, 1, 1, 10),
    voices: scaleValue(0, 1, 120, 1220.0),
    harmonicity: scaleValue(0, 1, 0.1, 100),
    frequency: scaleValue(0, 1, 220, 1220),
    partials: scaleValue(0, 1, 1, 10),
    voice_one: scaleValue(0, 1, 1200, 2220.0),
    voice_two: scaleValue(0, 1, 1200, 2220.0),
    voice_three: scaleValue(0, 1, 1200, 2220.0),
    voice_four: scaleValue(0, 1, 120, 2220.0)
};

export default specs;
