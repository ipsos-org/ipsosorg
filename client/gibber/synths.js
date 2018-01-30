someSynths = {

    saw : Synth({
        waveform:'saw',
        useADSR: true,
        triggerRelease: false
    }).connect(),

    pulse : Synth({
        waveform:'pwm',
        useADSR: true,
        triggerRelease: false
    }).connect(),

    sine : Synth({
        useADSR: true,
        waveform:'sine'
    }).connect(),

    square : Synth({
        useADSR: true,
        waveform:'square'
    }).connect()

};

export default someSynths;
