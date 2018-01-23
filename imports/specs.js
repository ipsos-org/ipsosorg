let scaleValue = require('scale-value');

const specs = {
    attack: scaleValue(0, 1, 100, 44100),
    decay: scaleValue(0, 1, 100, 22050),
    sustain: scaleValue(0, 1, 100, 44100),
    release: scaleValue(0, 1, 1, 100),
    gain: scaleValue(0, 1, 0.1, 0.8),
    frequency: scaleValue(0, 1, 120.0, 1220.0),
    triggerRelease: scaleValue(0, 1, 0.1, 10)
};

export default specs;
