import { noUiSlider } from 'meteor/rcy:nouislider';
import specs from '../imports/specs.js';

import events from '../lib/events_v0/events.js';

var Tone = require("Tone");

var polySynth = new Tone.PolySynth(4, Tone.Synth).toMaster();

//console.log(events.one['muons'].map(items => Object.keys(items)));

function selectEventVal(event){
    var getValues = events[event].muons.map(items => Object.values(items));
    Session.set('muons', getValues);
  return getValues;
};

selectEventVal('event_one');

if (Meteor.isClient) {
    Session.setDefault("slider", [1, 5]);
    
    Template.ipsosboard.rendered = function () {
        this.$("#range-slider").noUiSlider({
            start: Session.get("slider"),
            connect: true,
            range: {
                'min': 0.1,
                'max': 10.0
            }
        }).on('slide', function (ev, val) {
            Session.set('slider', [Math.round(val[0]), Math.round(val[1])]);
            var setValues = normalize_scale_offset(Session.get('selected'), val[0], val[1]);
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

    function triggerSynth(array){
        polySynth.triggerAttack(array);
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
            return ['attack', 'decay', 'sustain', 'release', 'modulationIndex', 'harmonicity', 'detune', 'voice_one', 'voice_two', 'voice_three'];
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

   /* var pattern = new Tone.Pattern(function(time, note){
	      polySynth.triggerAttackRelease(note, 2);
    }, ["C4", "E4", "G4", "A4"]);
   */

    function triggerSynthNotes(input){
        console.log(input);
        return input;
    }

    Template.ipsosboard.events({
        "change #event-select": function(event, template) {
            var selectedEvent = $( event.currentTarget ).val();
            selectedEvent = selectEventVal(selectedEvent);
        },
        'click button': function(event) {
            if(event.target.id == 'play'){
                polySynth.triggerAttack([voice_one.value, voice_two.value, voice_three.value]);
                //pattern.start(0);
                //Tone.Transport.start();
            } else {
                polySynth.triggerAttack([voice_one.value, voice_two.value, voice_three.value]);
                //Tone.Transport.stop();
                //pattern.stop();
                //Tone.Transport.stop(0);
            }
        },
        'input input[type="range"]': function(event){
            Session.set(event.target.id, event.target.value);
        },
        'click #matrix-input': function(event, template){
            var selected = template.findAll("input[type=checkbox]:checked");
            var par = $(event.target).attr('class');
            var fieldValue = event.target.value;

            var voice_one = template.find('input[name*="voice_one"]:checked'),
                voice_two =  template.find('input[name*="voice_two"]:checked'),
                voice_three = template.find('input[name*="voice_three"]:checked');
            console.log(voice_one.value);
            console.log(voice_two.value);
            console.log(voice_three.value);

            if(par !== ""){
                var envelope = {};
                envelope[par] = specs[par](fieldValue);
                polySynth.set({
                    "envelope" : envelope
                });
            }
        }
    });
};
