import specs from '../imports/specs.js';
import eventsNew from '../lib/events_new/events.js';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { EJSON } from 'meteor/ejson';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

var Tone = require("Tone");


//Session.setDefault('slider', [0.1, 0.6]);
Session.setDefault('midinote', [20.0, 60.0]);
Session.setDefault('attack', [0.01, 0.1]);
Session.setDefault('decay', [0.1, 0.6]);
Session.setDefault('sustain', [0.1, 0.6]);
Session.setDefault('detune', [1.0, 50.0]);
Session.setDefault('release', [0.1, 0.6]);
Session.setDefault('duration', [0.1, 1.0]);


if (Meteor.isClient) {

Template.ipsosboard.onCreated(function () {

  this.listParams = [
    'attack',    'decay',       'sustain',
    'release',   'detune',      'midinote',  'duration'
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
  this.chordmode = true;
  this.storedSonifications = [];
  this.storeIndex = 0;
  this.storeSynths = [[], [], [], [], [], [], [], [], []];


});

    Template.ipsosboard.helpers({

        listParams: () => Template.instance().listParams,

        getEventNumber: () => Template.instance().activeEvent.get().eventNumber,
        getEventData  : () => Template.instance().activeEvent.get().date_time,

        // here we can easily add new data types
        getSonificationData: function() {
          return [
            {type : "Jet", data : Template.instance().activeEvent.get().jets},
            {type : "Muon", data : Template.instance().activeEvent.get().muons},
	    {type: "Electron", data: Template.instance().activeEvent.get().electrons}
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
            // sort synthParameters

            var rbs = instance.findAll('input[type=radio]:checked');
            var checked = rbs.filter(function(rb) { return $(rb).attr('data-type') == "matrixbutton"})
            var synthParameters = {};

            for ( var c in checked ) {
              var element = $(checked[c]).attr('data-element');
              if(typeof synthParameters[element] == 'undefined') {
                synthParameters[element] = {};
              }
              var par = $(checked[c]).attr('class');
              var physpar = $(checked[c]).attr('data-physicsparam');
              var fieldValue = $(checked[c]).attr('value');
              synthParameters[element][par] = specs[physpar](fieldValue, Number(Session.get(par)[0]), Number(Session.get(par)[1]));

            }

            console.log(`synthpar `, synthParameters);
            instance.synthParameters = synthParameters;

            // clean up from last time
            for (var s in instance.synthArray) { instance.synthArray[s][0].dispose(); }

            instance.synthArray = [];

            for (var element in instance.synthParameters) {
                var params = instance.synthParameters[element];
                console.log(`params4synth `, params);
                var synth = new Tone.Synth({
                    "oscillator" : {
                      "type" : "sine",
                      "detune" : Number(params["detune"]),
                      "frequency" : Tone.Frequency.mtof(Number(params["midinote"]))
                    },
                    "envelope" : {
                        "attack" : Number(params["attack"]),
                        "decay" : Number(params["decay"]), //some values for 'decay' crash synth error: "not finite floting point value".
                        "sustain" : Number(params["sustain"]),
                        "release" : Number(params["release"])
                    }
                }).toMaster();

                if ($("#chord").prop("checked")) {
                    this.chordmode = true;
                } else {
                    this.chordmode = false;
                }

                instance.synthArray.push([synth, Number(params["duration"]), Tone.Frequency.mtof(Number(params["midinote"]))]);
            }
            var when = Tone.now();
            for (var s in instance.synthArray) {
              var synth = instance.synthArray[s][0];
              var dur = instance.synthArray[s][1];
              var note = instance.synthArray[s][2];
              console.log(`when `, when);
              synth.triggerAttackRelease(note, dur, when);
              if(!this.chordmode) { when = when + dur; }
            }

        },

        'click .store': function(event, instance) {
          // this duplicates a lot of code in play, so should be factored out later
          var rbs = instance.findAll('input[type=radio]:checked');
          var checked = rbs.filter(function(rb) { return $(rb).attr('data-type') == "matrixbutton"})
          var synthParameters = {};

          for ( var c in checked ) {
            var element = $(checked[c]).attr('data-element');
            if(typeof synthParameters[element] == 'undefined') {
              synthParameters[element] = {};
            }
            var par = $(checked[c]).attr('class');
            var physpar = $(checked[c]).attr('data-physicsparam');
            var fieldValue = $(checked[c]).attr('value');
            synthParameters[element][par] = specs[physpar](fieldValue, Number(Session.get(par)[0]), Number(Session.get(par)[1]));
          }

          var storedParams = {};

          storedParams["synthParams"] = synthParameters;
          storedParams["chordmode"] = this.chordmode;

          var storeButton = instance.find('[data-playind=' + instance.storeIndex + ']');

          $(storeButton).attr('class', "btn btn-success");
          setTimeout(function() {$(storeButton).attr('class', "btn btn-secondary btn-lg");}, 250);
          setTimeout(function() {$(storeButton).attr('class', "btn btn-success btn-lg");}, 500);
          instance.storedSonifications[instance.storeIndex] = storedParams;
          instance.storeIndex = (instance.storeIndex + 1)%9;
        },

        'click .stop': function(event, instance) {
          for (var s in instance.synthArray) {
            var synth = instance.synthArray[s][0];
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


  "click [data-type='playbutton']": ( (event, instance) => {
    var ind = Number($(event.target).attr("data-playind"));

    console.log(event);
    var storedParams = instance.storedSonifications[ind];
    if(typeof storedParams != 'undefined') {
      var synthParameters = storedParams["synthParams"];
      var chordMode = storedParams["chordmode"];

      var synthArray = instance.storeSynths[ind];

      // clean up from last time
      for (var s in synthArray) { synthArray[s][0].dispose(); }

      synthArray = [];

      for (var element in synthParameters) {
        var params = synthParameters[element];
        console.log(`params4synth `, params);
        var synth = new Tone.Synth({
          "oscillator" : {
            "type" : "sine",
            "detune" : Number(params["detune"]),
            "frequency" : Tone.Frequency.mtof(Number(params["midinote"]))
          },
          "envelope" : {
            "attack" : Number(params["attack"]),
            "decay" : Number(params["decay"]), //some values for 'decay' crash synth error: "not finite floting point value".
            "sustain" : Number(params["sustain"]),
            "release" : Number(params["release"])
          }
        }).toMaster();

        if ($("#chord").prop("checked")) {
          this.chordmode = true;
        } else {
          this.chordmode = false;
        }

        synthArray.push([synth, Number(params["duration"]), Tone.Frequency.mtof(Number(params["midinote"]))]);
      }
      instance.storeSynths[ind] = synthArray;
      var when = Tone.now();
      for (var s in synthArray) {
        var synth = synthArray[s][0];
        var dur = synthArray[s][1];
        var note = synthArray[s][2];
        console.log(`when `, when);
        synth.triggerAttackRelease(note, dur, when);
        if(!chordmode) { when = when + dur; }
      }
    }
  })


        });

};
