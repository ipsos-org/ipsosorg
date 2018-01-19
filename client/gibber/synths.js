pulse = Synth({
    waveform:'pwm',
    attack:44,
    decay:22050,
    release:0.3
}).connect();

saw = Synth({
    waveform:'saw',
    attack:88,
    decay:44100, 
    release:0.6
}).connect();

sine = Synth({
    waveform:'sine',
    attack:440,
    decay:11025, 
    release:0.1
}).connect();
