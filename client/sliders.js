var noUiSlider = require('nouislider');

Template.ipsosboard.rendered = function () {

    this.$("#voice-slider1").noUiSlider({
        start: Session.get('slider'),
        orientation: "vertical",
        connect: true,
        step: 0.01,
        margin: 0.1,
        range: {
            'min': [0.01],
            'max': [1.0]
        }
    }).on('slide', function (ev, val) {
        Session.set(this.id, [val[0], val[1]]);
        console.log(this.id);
    });

    this.$("#voice-slider2").noUiSlider({
        start: Session.get('slider'),
        orientation: "vertical",
        connect: true,
        step: 0.01,
        margin: 0.1,
        range: {
            'min': [0.01],
            'max': [1.0]
        }
    }).on('slide', function (ev, val) {
        Session.set(this.id, [val[0], val[1]]);
        console.log(this.id);
    });

    this.$("#voice-slider3").noUiSlider({
        start: Session.get('slider'),
        orientation: "vertical",
        connect: true,
        step: 0.01,
        margin: 0.1,
        range: {
            'min': [0.01],
            'max': [1.0]
        }
    }).on('slide', function (ev, val) {
        Session.set(this.id, [val[0], val[1]]);
        console.log(this.id);
    });

    this.$("#voice-slider4").noUiSlider({
        start: Session.get('slider'),
        orientation: "vertical",
        connect: true,
        step: 0.01,
        margin: 0.1,
        range: {
            'min': [0.01],
            'max': [1.0]
        }
    }).on('slide', function (ev, val) {
        Session.set(this.id, [val[0], val[1]]);
        console.log(this.id);
    });

    this.$("#voice-dur").noUiSlider({
        start: Session.get('slider'),
        orientation: "vertical",
        connect: true,
        step: 0.01,
        margin: 0.1,
        range: {
            'min': [0.01],
            'max': [1.0]
        }
    }).on('slide', function (ev, val) {
        Session.set(this.id, [val[0], val[1]]);
        console.log(this.id);
    });

    this.$("#detune").noUiSlider({
        start: Session.get('slider'),
        orientation: "vertical",
        connect: true,
        step: 0.01,
        margin: 0.1,
        range: {
            'min': [0.01],
            'max': [1.0]
        }
    }).on('slide', function (ev, val) {
        Session.set(this.id, [val[0], val[1]]);
        console.log(this.id);
    });

    this.$("#attack").noUiSlider({
        start: Session.get('slider'),
        orientation: "vertical",
        connect: true,
        step: 0.01,
        margin: 0.1,
        range: {
            'min': [0.01],
            'max': [1.0]
        }
    }).on('slide', function (ev, val) {
        Session.set(this.id, [val[0], val[1]]);
        console.log(this.id);
    });

    this.$("#decay").noUiSlider({
        start: Session.get('slider'),
        orientation: "vertical",
        connect: true,
        step: 0.01,
        margin: 0.1,
        range: {
            'min': [0.01],
            'max': [1.0]
        }
    }).on('slide', function (ev, val) {
        Session.set(this.id, [val[0], val[1]]);
        console.log(this.id);
    });

    this.$("#sustain").noUiSlider({
        start: Session.get('slider'),
        orientation: "vertical",
        connect: true,
        step: 0.01,
        margin: 0.1,
        range: {
            'min': [0.01],
            'max': [1.0]
        }
    }).on('slide', function (ev, val) {
        Session.set(this.id, [val[0], val[1]]);
        console.log(this.id);
    });
};
