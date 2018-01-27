let scaleValue = require('scale-value');

const specs = {
    attack: scaleValue(0, 1, 0.1, 1.0),
    decay: scaleValue(0, 1, 0.1, 1.0 * 11025),
    sustain: scaleValue(0, 1, 0.1, 1.0 * 44100),
    release: scaleValue(0, 1, 0.1, 1.0 * 22050),
    gain: scaleValue(0, 1, 0.1, 0.1, 1.0),
    frequency: scaleValue(0, 1, 120.0, 1220.0)
};

export default specs;
