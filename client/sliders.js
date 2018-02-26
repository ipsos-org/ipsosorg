var noUiSlider = require('nouislider');

Template.ipsosboard.rendered = function () {

    this.$("#voice-slider1").noUiSlider({
        start: Session.get('slider'),
        orientation: "vertical",
        connect: true,
        step: 100,
        margin: 300,
        range: {
            'min': 20.0,
            'max': 20000.0
        }
    }).on('slide', function (ev, val) {
        Session.set(this.id, [val[0], val[1]]);
    }).on('change', function (ev, val) {
        Session.set(this.id, [Math.round(val[0]), Math.round(val[1])]);
        console.log(this.id + val);
    });

    this.$("#voice-slider2").noUiSlider({
        start: Session.get('slider'),
        orientation: "vertical",
        connect: true,
        step: 100,
        margin: 300,
        range: {
            'min': 20.0,
            'max': 20000.0
        }
    }).on('slide', function (ev, val) {
        Session.set(this.id, [val[0], val[1]]);
    }).on('change', function (ev, val) {
        Session.set(this.id, [Math.round(val[0]), Math.round(val[1])]);
        console.log(this.id + val);
    });

    this.$("#voice-slider3").noUiSlider({
        start: Session.get('slider'),
        orientation: "vertical",
        connect: true,
        step: 100,
        margin: 300,
        range: {
            'min': 20.0,
            'max': 20000.0
        }
    }).on('slide', function (ev, val) {
        Session.set(this.id, [val[0], val[1]]);
    }).on('change', function (ev, val) {
        Session.set(this.id, [Math.round(val[0]), Math.round(val[1])]);
        console.log(this.id + val);
    });

    this.$("#voice-slider4").noUiSlider({
        start: Session.get('slider'),
        orientation: "vertical",
        connect: true,
        step: 100,
        margin: 300,
        range: {
            'min': 20.0,
            'max': 20000.0
        }
    }).on('slide', function (ev, val) {
        Session.set(this.id, [val[0], val[1]]);
    }).on('change', function (ev, val) {
        Session.set(this.id, [Math.round(val[0]), Math.round(val[1])]);
        console.log(this.id + val);
    });

    this.$("#release").noUiSlider({
        start: Session.get('slider'),
        orientation: "vertical",
        direction: 'rtl',
        connect: true,
        step: 0.01,
        margin: 0.1,
        range: {
            'min': 0.1,
            'max': 0.9
        }
    }).on('slide', function (ev, val) {
        Session.set(this.id, [val[0], val[1]]);
        console.log(this.id + val);
    }).on('change', function (ev, val) {
        Session.set(this.id, [Math.round(val[0]), Math.round(val[1])]);
        console.log(this.id + val);
    });

    this.$("#detune").noUiSlider({
        start: Session.get('slider'),
        orientation: "vertical",
        direction: 'rtl',
        connect: true,
        step: 1,
        margin: 0.1,
        range: {
            'min': 1,
            'max': 100
        }
    }).on('slide', function (ev, val) {
        Session.set(this.id, [val[0], val[1]]);
        console.log(this.id + val);
    }).on('change', function (ev, val) {
        Session.set(this.id, [Math.round(val[0]), Math.round(val[1])]);
        console.log(this.id + val);
    });

    this.$("#attack").noUiSlider({
        start: Session.get('slider'),
        orientation: "vertical",
        direction: 'rtl',
        connect: true,
        step: 0.01,
        margin: 0.01,
        range: {
            'min': 0.01,
            'max': 0.99
        }
    }).on('slide', function (ev, val) {
        Session.set(this.id, [val[0], val[1]]);
        console.log(this.id + val);
    }).on('change', function (ev, val) {
        Session.set(this.id, [Math.round(val[0]), Math.round(val[1])]);
        console.log(this.id + val);
    });

    this.$("#decay").noUiSlider({
        start: Session.get('slider'),
        orientation: "vertical",
        direction: "rtl",
        connect: true,
        step: 0.01,
        margin: 0.01,
        range: {
            'min': 0.01,
            'max': 0.8
        }
    }).on('slide', function (ev, val) {
        Session.set(this.id, [val[0], val[1]]);
        console.log(this.id + val);
    }).on('change', function (ev, val) {
        Session.set(this.id, [Math.round(val[0]), Math.round(val[1])]);
        console.log(this.id + val);
    });

    this.$("#sustain").noUiSlider({
        start: Session.get('slider'),
        orientation: "vertical",
        direction: 'rtl',
        connect: true,
        step: 0.01,
        margin: 0.01,
        range: {
            'min': 0.1,
            'max': 1.0
        }
    }).on('slide', function (ev, val) {
        Session.set(this.id, [val[0], val[1]]);
        console.log(this.id + val);
    }).on('change', function (ev, val) {
        Session.set(this.id, [Math.round(val[0]), Math.round(val[1])]);
        console.log(this.id + val);
    });

};
