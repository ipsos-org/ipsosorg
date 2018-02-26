import specs from '../imports/specs.js';
import polySynth from '../imports/tone.js';
import EVENTS from '../lib/events_v0/events.js';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './ipsosboard.html';

Session.setDefault('slider', [0.1, 0.6]);
Session.setDefault('voiceOne', [20.0, 20000.0]);
Session.setDefault('voiceTwo', [20.0, 20000.0]);
Session.setDefault('voiceThree', [1500, 15000]);
Session.setDefault('voiceFour', [1500, 15000]);
Session.setDefault('voice-dur', [0.1, 0.6]);
Session.setDefault('attack', [0.01, 0.1]);
Session.setDefault('decay', [0.1, 0.6]);
Session.setDefault('sustain', [0.1, 0.6]);
Session.setDefault('detune', [0.1, 0.6]);

if (Meteor.isClient) {

    const selectEvent = function selectEvent( eventName ) {

        const eventMuons = EVENTS[ eventName ] || [];
        const muons = [];
        
        eventMuons.muons.forEach(function ( obj ) {
            Object.keys( obj ).forEach(function ( key ) {
                muons.push( [ key, obj[ key ] ] );
            });
        });

        return muons;
    };

    Template.ipsosboard.onCreated(function () {

        this.listParams = [
            'attack',    'decay',       'sustain',
            'release',   'detune',      'voice_one',
            'voice_two', 'voice_three', 'voice_four',
        ];

        this.muons  = [];
        const template = this;

        this.activeEvent = new ReactiveVar('event_one');
    });

    Template.ipsosboard.helpers({
        attack: () => Session.get("attack"),
        decay: () => Session.get("decay"),
        sustain: () => Session.get("sustain"),
        release: () => Session.get("release"),
        detune: () => Session.get("detune"),
        voiceOne: () => Session.get("voiceOne"),
        voiceTwo: () => Session.get("voiceTwo"),
        voiceThree: () => Session.get("voiceThree"),
        voiceFour: () => Session.get("voiceFour"),

        listParams: () => Template.instance().listParams,

        allMuons() {
            const event = Template.instance().activeEvent.get();
            return selectEvent( event );
        },

        getMuonLabel: ( tuple ) => tuple[ 0 ],
        getMuonValue: ( tuple ) => tuple[ 1 ]
    });

    Template.ipsosboard.events({
        "change #event-select": function(event, tplInstance) {
            var selectedElem = event.currentTarget.selectedOptions[ 0 ];
            tplInstance.activeEvent.set( selectedElem.value );
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
                specs['voice_one'](voice1.value, Session.get('voiceSliderOne')[0], Session.get('voiceSliderOne')[1]),
                specs['voice_two'](voice2.value, Session.get('voiceSliderTwo')[0], Session.get('voiceSliderTwo')[1]),
                specs['voice_three'](voice3.value, Session.get('voiceSliderThree')[0], Session.get('voiceSliderThree')[1]),
                specs['voice_four'](voice4.value, Session.get('voiceSliderFour')[0], Session.get('voiceSliderFour')[1])
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
