import specs from '../imports/specs.js';
import polySynth from '../imports/tone.js';
import events from '../lib/events_v0/events.js';

function selectEventVal(event){
    var getValues = events[event].muons.map(items => Object.values(items));
    Session.set('muons', getValues);
    return getValues;
};

//selectEventVal('event_one');


Session.setDefault('slider', [0.1, 0.6]);
Session.setDefault('voice-slider1', [0.1, 0.6]);
Session.setDefault('voice-slider2', [0.1, 0.6]);
Session.setDefault('voice-slider3', [0.1, 0.6]);
Session.setDefault('voice-slider4', [0.1, 0.6]);
Session.setDefault('voice-dur', [0.1, 0.6]);
Session.setDefault('attack', [0.01, 0.1]);
Session.setDefault('decay', [0.1, 0.6]);
Session.setDefault('sustain', [0.1, 0.6]);
Session.setDefault('detune', [0.1, 0.6]);

if (Meteor.isClient) {

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

        /*'synths': function() {
            return Object.keys(someSynths);
        },*/

        'slider': function () {
            return Session.get("slider");
        },
        'listParams': function () {
            //return Object.keys(polySynth);
            return ['attack', 'decay', 'sustain', 'release', 'detune', 'voice_one', 'voice_two', 'voice_three', 'voice_four'];
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
        'click .play': function(event) {
            var voices = Session.get('voices');
            polySynth.triggerAttackRelease(voices, 0.5);
            console.log(`Voices `, voices);
        },

        'click .stop': function(event) {
            console.log('stop pressed');
            var voices = Session.get('voices');
            polySynth.triggerRelease(voices);
        },

        'click #matrix-input': function(event, template){
            var selected = template.findAll("input[type=checkbox]:checked");
            var par = $(event.target).attr('class');
            var fieldValue = event.target.value;
            var envelope = {};
            var voices = [];
            
            var voice1 = template.find('input[name*="voice_one"]:checked'),
                voice2 = template.find('input[name*="voice_two"]:checked'),
                voice3 = template.find('input[name*="voice_three"]:checked'),
                voice4 = template.find('input[name*="voice_four"]:checked');

            voices = [
                specs['voice_one'](voice1.value, Session.get('voice-slider1')[0], Session.get('voice-slider1')[1]),
                specs['voice_two'](voice2.value, Session.get('voice-slider2')[0], Session.get('voice-slider2')[1]),
                specs['voice_three'](voice3.value, Session.get('voice-slider3')[0], Session.get('voice-slider3')[1]),
                specs['voice_four'](voice4.value, Session.get('voice-slider4')[0], Session.get('voice-slider4')[1])
            ];
            var sliders = Session.get(par);
            envelope[par] = specs[par](Math.round(fieldValue), sliders[0], sliders[1]);
            polySynth.set(par,  specs[par](Math.round(fieldValue), sliders[0], sliders[1]));
            Session.set('voices', voices);
            polySynth.set({
                "envelope" : envelope
            });
            console.log(`Envelope `, envelope);
        }
    });

};
