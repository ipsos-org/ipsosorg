import specs from '../imports/specs.js';
import eventsNew from '../lib/events_new/events.js';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { EJSON } from 'meteor/ejson';

var Tone = require("Tone");

Session.setDefault('slider', [0.1, 0.6]);
Session.setDefault('frequency', [0.1, 0.6]);
Session.setDefault('attack', [0.01, 0.1]);
Session.setDefault('decay', [0.1, 0.6]);
Session.setDefault('sustain', [0.1, 0.6]);
Session.setDefault('detune', [0.1, 0.6]);
Session.setDefault('release', [0.1, 0.6]);
Session.setDefault('duration', [0.1, 0.5]);

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


  this.state = {}; // Make this a ReactiveDict?

  this.synthParameters = {};
  this.synthArray = [];

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

        incremented(index) { return (index + 1)},
        
    });

    Template.ipsosboard.events({

        'change #event-select'( event, tplInstance ) {
            const selectedElem = event.currentTarget.selectedOptions[ 0 ];
            tplInstance.activeEventName.set( selectedElem.value );
        },

        'click .play': function(event, instance) {
            //something to start the synth here...
            
            // clean up from last time
            for (var s in instance.synthArray) { instance.synthArray[s].dispose(); }

            instance.synthArray = [];

            for (var element in instance.synthParameters) {
                var params = instance.synthParameters[element];

                console.log(`params4synth `, params);
                var synth = new Tone.Synth({
                    "oscillator" : {
                        "type" : "sine",
                        "detune" : Math.abs(params["detune"]),
                        "frequency" : Math.abs(params["frequency"])
                    },
                    "envelope" : {
                        "attack" : Math.abs(params["attack"]),
                        "decay" : Math.abs(params["decay"]),
                        "sustain" : Math.abs(params["sustain"]),
                        "release" : Math.abs(params["release"])
                    },
                }).toMaster();

                instance.synthArray.push(synth);
            }

            for (var s in instance.synthArray) {
                var synth = instance.synthArray[s];
                var note = Math.abs(params['frequency']), dur = Session.get('duration');
                synth.triggerAttackRelease(note, dur);
            }

        },

        'click .stop': function(event, instance) {
          for (var s in instance.synthArray) {
            var synth = instance.synthArray[s];
            synth.triggerRelease();
          }
        },

        'click .save': function(event, instance) {

	    instance.state.curValue = instance.activeEventName.curValue;
	    instance.state.checked = [];
	    instance.state.params = {};

	    var checked = instance.findAll('input[type=radio]:checked');

	    for ( var c in checked ) {

		instance.state.checked.push($(checked[c]).attr('id'));

	    }

	    for ( var pi in instance.listParams ) {

		var param = instance.listParams[pi];
		instance.state.params[param] = Session.get(param);

	    }

	    var blob = new Blob([EJSON.stringify(instance.state)], {type: 'text/plain'});
	    var objectURL = URL.createObjectURL(blob);

	    var link = document.createElement('a');
	    link.style.display = 'none';
	    document.body.appendChild(link);

	    link.href = objectURL;
	    link.download = 'state_'+ new Date().valueOf() +'.json';
	    link.target = '_blank';
	    link.click();

	},

        'click #matrix-table': function(event, instance){

	          var checked = instance.findAll('input[type=radio]:checked');

            var synthParameters = {};

            for ( var c in checked ) {
              var element = $(checked[c]).attr('data-element');
              if(typeof synthParameters[element] == 'undefined') {
                synthParameters[element] = {};
              }
              var par = $(checked[c]).attr('class');
              var fieldValue = $(checked[c]).attr('value');
              synthParameters[element][par] = specs[par](fieldValue, Session.get(par)[0], Session.get(par)[1]);

            }

            console.log(`synthpar `, synthParameters);
            instance.synthParameters = synthParameters;
        }

    });

};
