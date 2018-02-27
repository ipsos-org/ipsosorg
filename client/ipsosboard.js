import specs from '../imports/specs.js';
import synthA from '../imports/synthA.js';
import synthB from '../imports/synthB.js';
import EVENTS from '../lib/events_v0/events.js';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
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
    

    const transformData = function transformData( events ) {

        const newDataObject = {};

        for (let eventName in events ) {

            const currentEvent = events[ eventName ];

            // transform muons by creating tuples
            const transformedMuons = [];

            currentEvent.muons.forEach(function ( obj ) {
                Object.keys( obj ).forEach(function ( key ) {
                    transformedMuons.push( [ key, obj[ key ] ] );
                });
            });

            // copy event object into a new object,
            // and override 'muons' key with our transformed muons data
            newDataObject[ eventName ] = Object.assign( {}, currentEvent, {
                muons: transformedMuons
            });
        }

        return newDataObject;
    };

Template.ipsosboard.onCreated(function () {

  this.listParams = [
    'attack',    'decay',       'sustain',
    'release',   'detune',      'frequency'
  ];

  // transform your data by creating tuples for each label/value
  // [ [ 'labelA', labelA_value ], [ 'labelB', labelB_value ], ... ]
  this.events = transformData( EVENTS );

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

        getEventMuons : () => Template.instance().activeEvent.get().muons,
        getEventNumber: () => Template.instance().activeEvent.get().eventNumber,
        getEventData  : () => Template.instance().activeEvent.get().date_time,

        getMuonLabel: ( tuple ) => tuple[ 0 ],
        getMuonValue: ( tuple ) => tuple[ 1 ],

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
            synthA.triggerAttackRelease(Session.get('freq'), 0.75);
            triggerSynth();
        },

        'click .stop': function(event) {
            synthA.triggerRelease();
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
            
            synthA.set({
                "envelope" : envelope
            });

            synthB.set({
                "envelope" : envelope
            });

            console.log(`Setter `, freqModifier);
        }
    });

};
