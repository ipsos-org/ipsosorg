pulse = Synth({
    useADSR: true,
    waveform:'pwm'
}).connect();

saw = Synth({
    waveform:'saw',
    useADSR: true,
    triggerRelease: false
}).connect();

sine = Synth({
    useADSR: true,
    waveform:'sine'
}).connect();

square = Synth({
    useADSR: true,
    waveform:'square'
}).connect();
