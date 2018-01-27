someSynths = {

    pulse : PolySynth({
        waveform: 'saw',
        maxVoices: 3,
        useADSR: true
    }),

    saw : Synth({
        waveform:'saw',
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
