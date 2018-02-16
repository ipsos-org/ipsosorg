//import noUiSlider from 'nouislider';
import specs from '../imports/specs.js';

import events from '../lib/events_v0/events.js';

var Tone = require("Tone");
var noUiSlider = require('nouislider');
var polySynth = new Tone.PolySynth(3, Tone.Synth).toMaster();

let scaleValue = require('scale-value');

Session.setDefault('slider', [0.1, 0.25]);

function selectEventVal(event){
    var getValues = events[event].muons.map(items => Object.values(items));
    Session.set('muons', getValues);
    return getValues;
};

selectEventVal('event_one');

if (Meteor.isClient) {

    Template.ipsosboard.rendered = function () {
        this.$("#voice-slider1").noUiSlider({
            start: Session.get('slider'),
            connect: true,
            step: 0.01,
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
            connect: true,
            step: 0.01,
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
            connect: true,
            step: 0.01,
            range: {
                'min': [0.01],
                'max': [1.0]
            }
        }).on('slide', function (ev, val) {
            Session.set(this.id, [val[0], val[1]]);
            console.log(this.id);
        });
       
    };

    function getOnlyNeed(input){
        var lookFor = ['frequency', 'frequency', 'frequency']; //only this params will be available.
        var filter = input.filter(item => lookFor.includes(item));
        console.log(filter);
        return filter;
    };

    function pushCurEventValToTable(){
        var curEvent = Session.get('muons');
        curEvent = [].concat.apply([], curEvent);
        return curEvent;
    };

    Template.ipsosboard.helpers({
        'events': function() {
            return Object.keys(events);
        },
        'dataItems': function(){
            return pushCurEventValToTable();
        },
        'synths': function() {
            return Object.keys(someSynths);
        },
        'slider': function () {
            return Session.get("slider");
        },
        'listParams': function () {
            //return Object.keys(polySynth);
            return ['attack', 'decay', 'sustain', 'release', 'detune', 'voice_one', 'voice_two', 'voice_three'];
        },
        getField(item, field){
            return item[field];
        },
        'getKeys': function(){
            return Object.keys( events.event_one.muons[0]);
        },
        'eventInfo': function(){
            var eventData = event.time_date;
            return eventData;
        }
    });

    Template.ipsosboard.events({
        "change #event-select": function(event, template) {
            var selectedEvent = $( event.currentTarget ).val();
            selectedEvent = selectEventVal(selectedEvent);
        },
        'click button': function(event) {
            if(event.target.id == 'play'){
                ///do something when pressed play.
            } else {
                polySynth.triggerRelease();
            }
        },
        'input input[type="range"]': function(event){
            console.log("id of the slider is: ", event.target.id);
            console.log("its current value is: ", event.target.value);
            Session.set(event.target.id, event.target.value);
        },
        'click #matrix-input': function(event, template){
            var selected = template.findAll("input[type=checkbox]:checked");
            var par = $(event.target).attr('class');
            var fieldValue = event.target.value;

            var voice_one = template.find('input[name*="voice_one"]:checked'),
                voice_two =  template.find('input[name*="voice_two"]:checked'),
                voice_three = template.find('input[name*="voice_three"]:checked'),
                voiceDur = template.find('input[name*="release"]:checked');

            if(par !== ""){
                var envelope = {};
                envelope[par] = specs[par](fieldValue, Session.get('slider')[0], Session.get('slider')[1]);
                polySynth.set({
                    "envelope" : envelope
                });
                polySynth.set(par, specs[par](fieldValue, Session.get('slider')[0], Session.get('slider')[1]));
                var voices = [];
                voices.push(specs['voice_one'](voice_one.value, Session.get('voice-slider1')[0], Session.get('voice-slider1')[1]),
                            specs['voice_two'](voice_two.value, Session.get('voice-slider2')[0], Session.get('voice-slider2')[1]),
                            specs['voice_three'](voice_three.value, Session.get('voice-slider3')[0], Session.get('voice-slider3')[1]),
                           );
                if(voices.length === 3){
                    voices = voices.map(values => Math.round(values));//beware round function!
                    polySynth.triggerAttackRelease(voices, voiceDur.value);
                    console.log(voices);
                    console.log(envelope);
                }
            }
        }
    });
};
