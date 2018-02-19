import specs from '../imports/specs.js';
import polySynth from '../imports/tone.js';
import events from '../lib/events_v0/events.js';

function selectEventVal(event){
    var getValues = events[event].muons.map(items => Object.values(items));
    Session.set('muons', getValues);
    return getValues;
};

var Voices = [];

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
Session.setDefault('release', [0.01, 0.1]);

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
            console.log('play pressed');
            polySynth.triggerAttack(Voices);
            console.log(Voices);
        },

        'click .stop': function(event) {
            console.log('stop pressed');
            polySynth.triggerRelease(Voices);
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
            var envelope = {};
            var sliders = Session.get(par);

            var voice_one = template.find('input[name*="voice_one"]:checked'),
                voice_two = template.find('input[name*="voice_two"]:checked'),
                voice_three = template.find('input[name*="voice_three"]:checked'),
                voice_four = template.find('input[name*="voice_four"]:checked');

            Voices = [
                    specs['voice_one'](voice_one.value, Session.get('voice-slider1')[0], Session.get('voice-slider1')[1]),
                    specs['voice_two'](voice_two.value, Session.get('voice-slider2')[0], Session.get('voice-slider2')[1]),
                    specs['voice_three'](voice_three.value, Session.get('voice-slider3')[0], Session.get('voice-slider3')[1]),
                    specs['voice_four'](voice_four.value, Session.get('voice-slider4')[0], Session.get('voice-slider4')[1])
                ];


            if(par != null || par !== ""){
                if(Voices != null || Voices.length === 4){
                    if(sliders != null){ 
                        envelope[par] = specs[par](fieldValue, sliders[0], sliders[1]);
                    polySynth.set({
                        "envelope" : envelope
                    });
                    polySynth.set(par, specs[par](fieldValue, sliders[0], sliders[1]));
                    console.log(envelope);
                        console.log(Voices);
                    }
                }
            }
        }

    });

};
