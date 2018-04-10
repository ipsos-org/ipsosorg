var noUiSlider = require('nouislider');

Template.ipsosboard.rendered = function () {
    
    var duration = Session.get('duration');
    $('#duration-low').text(duration[0]);
    $('#duration-high').text(duration[1]);

    this.$("#duration").noUiSlider({
	start: duration,
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
		
	$('#duration-low').text(val[0]);
	$('#duration-high').text(val[1]);

    }).on('change', function (ev, val) {
        Session.set(this.id, [val[0], val[1]]);
	});

    var midinote = Session.get('midinote');
    $('#midinote-low').text(midinote[0]);
    $('#midinote-high').text(midinote[1]);

    this.$("#midinote").noUiSlider({
        start: midinote,
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
	
	$('#midinote-low').text(val[0]);
	$('#midinote-high').text(val[1]);

    }).on('change', function (ev, val) {
        Session.set(this.id, [val[0], val[1]]);
	});

    var release = Session.get('release');
    $('#release-low').text(release[0]);
    $('#release-high').text(release[1]);

    this.$("#release").noUiSlider({
        start: release,
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
	
	$('#release-low').text(val[0]);
	$('#release-high').text(val[1]);

    }).on('change', function (ev, val) {
        Session.set(this.id, [val[0], val[1]]);
    });

    var detune = Session.get('detune');
    $('#detune-low').text(detune[0]);
    $('#detune-high').text(detune[1]);

    this.$("#detune").noUiSlider({
        start: detune,
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

	$('#detune-low').text(val[0]);
	$('#detune-high').text(val[1]);

    }).on('change', function (ev, val) {
        Session.set(this.id, [val[0], val[1]]);
    });

    var attack = Session.get('attack');
    $('#attack-low').text(attack[0]);
    $('#attack-high').text(attack[1]);

    this.$("#attack").noUiSlider({
        start: attack,
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
       
	$('#attack-low').text(val[0]);
	$('#attack-high').text(val[1]);

    }).on('change', function (ev, val) {
        Session.set(this.id, [val[0], val[1]]);
    });

    var decay = Session.get('attack');
    $('#decay-low').text(attack[0]);
    $('#decay-high').text(attack[1]);

    this.$("#decay").noUiSlider({
        start: decay,
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
       
	$('#decay-low').text(val[0]);
	$('#decay-high').text(val[1]);

    }).on('change', function (ev, val) {
        Session.set(this.id, [val[0], val[1]]);
    });

    var sustain = Session.get('sustain');
    $('#sustain-low').text(sustain[0]);
    $('#sustain-high').text(sustain[1]);

    this.$("#sustain").noUiSlider({
        start: sustain,
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
        
	$('#sustain-low').text(val[0]);
	$('#sustain-high').text(val[1]);

    }).on('change', function (ev, val) {
        Session.set(this.id, [val[0], val[1]]);
	});
};
