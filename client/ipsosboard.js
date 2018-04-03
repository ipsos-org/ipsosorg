import specs from '../imports/specs.js';
import EVENTS from '../lib/events_v0/events.js';
import eventsNew from '../lib/events_new/events.js';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
const Tone = require("Tone");

//import './ipsosboard.html';

Session.setDefault('slider', [0.1, 0.6]);
Session.setDefault('frequency', [0.1, 0.6]);
Session.setDefault('voice-dur', [0.1, 0.6]);
Session.setDefault('attack', [0.01, 0.1]);
Session.setDefault('decay', [0.1, 0.6]);
Session.setDefault('sustain', [0.1, 0.6]);
Session.setDefault('detune', [0.1, 0.6]);
Session.setDefault('release', [0.1, 0.6]);

if (Meteor.isClient) {

Template.ipsosboard.onCreated(function () {

  this.listParams = [
    'attack',    'decay',       'sustain',
    'release',   'detune',      'frequency'
  ];

  this.events = eventsNew;

  // default event name not hard-coded
  const defaultEventName = Object.keys( this.events )[ 0 ];
  this.activeEventName   = new ReactiveVar( defaultEventName );
  this.activeEvent       = new ReactiveVar();

  this.autorun(() => {
    // this will rerun each time its dependencies are changed (the ReactiveVar)
    const eventName   = this.activeEventName.get();
    const linkedEvent = this.events[ eventName ];
    this.activeEvent.set( linkedEvent );
  });
});

    Template.ipsosboard.helpers({

        listParams: () => Template.instance().listParams,

        getEventNumber: () => Template.instance().activeEvent.get().eventNumber,
        getEventData  : () => Template.instance().activeEvent.get().date_time,

        // here we can easily add new data types
        getSonificationData: function() {
          return [
            {type : "Jet", data : Template.instance().activeEvent.get().jets},
            {type : "Muon", data : Template.instance().activeEvent.get().muons}
          ]
        },

        getAllFields: function(dataObject) {
          let fields = [];

          _.each(Object.keys(dataObject), function(theKey) {
            fields.push({label: theKey, value: dataObject[theKey] });
          });

          fields = _.sortBy(fields, 'label');
          return fields;
        },

        /**
         * {{ #each }} can't loop over an Object
         * http://blazejs.org/api/spacebars.html#Each
         *
         * @returns {Array}
         */
        allEvents() {
            const eventsObj = Template.instance().events;
            const eventsArr = [];

            for (let eventName in eventsObj) {
                eventsArr.push({
                    name  : eventName,
                    number: eventsObj[ eventName ].number
                });
            }

            return eventsArr;
        },

        incremented(index) { return (index + 1); },

    });

    function triggerSynth(freq, release){
        return Session.set('freq', freq);
    };

    Template.ipsosboard.events({
        'change #event-select'( event, tplInstance ) {
            const selectedElem = event.currentTarget.selectedOptions[ 0 ];
            tplInstance.activeEventName.set( selectedElem.value );
        },
        'click .play': function(event) {
            //something to start the synth here...
            Synth.triggerAttackRelease(Session.get('freq'), 0.75);
            triggerSynth();
        },

        'click .stop': function(event) {
            Synth.triggerRelease();
        },

        'click #matrix-table': function(event, template){
            var selected = template.findAll("input[type=checkbox]:checked");
            var par = $(event.target).attr('class');
            var fieldValue = event.target.value;
            var envelope = {};
            var freqModifier = {};

            freqModifier[par] = specs[par](fieldValue, Session.get(par)[0], Session.get(par)[1]);
            envelope[par] = specs[par](fieldValue, Session.get(par)[0], Session.get(par)[1]);
            var freq = Object.values(freqModifier)[0];
            triggerSynth(freq);


            var Synth = new Tone.Synth({
                oscillator : {
  	                type : 'fmsquare',
                    modulationType : 'sawtooth',
                    modulationIndex : 3,
                    harmonicity: 3.4
                },

                envelope : envelope

            });

            console.log(`Setter `, freqModifier);
        }
    });

};
