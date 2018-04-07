var noUiSlider = require('nouislider');

Template.ipsosboard.rendered = function () {

    this.$("#duration").noUiSlider({
        start: Session.get('duration'),
        orientation: "vertical",
        connect: true,
        step: 0.01,
        margin: 0.1,
        range: {
            'min': 0.1,
            'max': 1.0
        }
    }).on('slide', function (ev, val) {
        Session.set(this.id, [val[0], val[1]]);
    }).on('change', function (ev, val) {
        Session.set(this.id, [val[0], val[1]]);
        console.log(this.id + val);
    }).Link('lower').to('-inline-<div class="tooltip"></div>', sliderHandler)
        .Link('upper').to('-inline-<div class="tooltip"></div>', sliderHandler);

    this.$("#midinote").noUiSlider({
        start: Session.get('midinote'),
        orientation: "vertical",
        connect: true,
        step: 0.1,
        margin: 0.1,
        range: {
            'min': 0.0,
            'max': 127.0
        }
    }).on('slide', function (ev, val) {
        Session.set(this.id, [val[0], val[1]]);
    }).on('change', function (ev, val) {
        Session.set(this.id, [val[0], val[1]]);
        console.log(this.id + val);
    }).Link('lower').to('-inline-<div class="tooltip"></div>', sliderHandler)
.Link('upper').to('-inline-<div class="tooltip"></div>', sliderHandler);

    this.$("#release").noUiSlider({
        start: Session.get('release'),
        orientation: "vertical",
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
        Session.set(this.id, [val[0], val[1]]);
        console.log(this.id + val);
    }).Link('lower').to('-inline-<div class="tooltip"></div>', sliderHandler)
.Link('upper').to('-inline-<div class="tooltip"></div>', sliderHandler);

    this.$("#detune").noUiSlider({
        start: Session.get('detune'),
        orientation: "vertical",
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
        Session.set(this.id, [val[0], val[1]]);
        console.log(this.id + val);
    }).Link('lower').to('-inline-<div class="tooltip"></div>', sliderHandler)
.Link('upper').to('-inline-<div class="tooltip"></div>', sliderHandler);

    this.$("#attack").noUiSlider({
        start: Session.get('attack'),
        orientation: "vertical",
        connect: true,
        step: 0.01,
        margin: 0.01,
        range: {
            'min': 0.01,
            'max': 0.1
        }
    }).on('slide', function (ev, val) {
        Session.set(this.id, [val[0], val[1]]);
        console.log(this.id + val);
    }).on('change', function (ev, val) {
        Session.set(this.id, [val[0], val[1]]);
        console.log(this.id + val);
    }).Link('lower').to('-inline-<div class="tooltip"></div>', sliderHandler)
.Link('upper').to('-inline-<div class="tooltip"></div>', sliderHandler);

    this.$("#decay").noUiSlider({
        start: Session.get('decay'),
        orientation: "vertical",
        connect: true,
        step: 0.01,
        margin: 0.1,
        range: {
            'min': 0.01,
            'max': 0.8
        }
    }).on('slide', function (ev, val) {
        Session.set(this.id, [val[0], val[1]]);
        console.log(this.id + val);
    }).on('change', function (ev, val) {
        Session.set(this.id, [val[0], val[1]]);
        console.log(this.id + val);
    }).Link('lower').to('-inline-<div class="tooltip"></div>', sliderHandler)
.Link('upper').to('-inline-<div class="tooltip"></div>', sliderHandler);

    this.$("#sustain").noUiSlider({
        start: Session.get('sustain'),
        orientation: "vertical",
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
        Session.set(this.id, [val[0], val[1]]);
        console.log(this.id + val);
    }).Link('lower').to('-inline-<div class="tooltip"></div>', sliderHandler)
.Link('upper').to('-inline-<div class="tooltip"></div>', sliderHandler);

    function sliderHandler(value, handle, slider){
        var values = slider.val();
        var tooltip = $('.tooltip').not($(this));
            tooltip.show();
            $(this).text(value)
            .css({
                'left': '-9px'
            });

    }

};
