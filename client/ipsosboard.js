import specs from '../imports/specs.js';
import eventsNew from '../lib/events_new/events.js';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { EJSON } from 'meteor/ejson';
import { Session } from 'meteor/session';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

import Tone from 'tone';

UnmuteButton({ tone : Tone }); 
//https://developers.google.com/web/updates/2017/09/autoplay-policy-changes


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

  this.synthTypes = ['sine', 'square', 'triangle', 'sawtooth'];

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

  this.chordmode = true;
  this.storedSonifications = [];
  this.storeIndex = 0;
  this.synthType = 'sine';


});

    Template.ipsosboard.helpers({

        listParams: () => Template.instance().listParams,

        synthTypes: () => Template.instance().synthTypes,

        getEventNumber: () => Template.instance().activeEvent.get().eventNumber,
        getEventData  : () => Template.instance().activeEvent.get().date_time,

        // here we can easily add new data types
        getSonificationData: function() {
          return [
            {type : "Jet", data : Template.instance().activeEvent.get().jets},
            {type : "Muon", data : Template.instance().activeEvent.get().muons},
	    {type: "Electron", data: Template.instance().activeEvent.get().electrons},
	    {type: "Photon", data: Template.instance().activeEvent.get().photons}
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

        'change #synthtype-select'( event, tplInstance ) {
            const selectedElem = event.currentTarget.selectedOptions[ 0 ];
            tplInstance.synthType = selectedElem.value;
        },

        'click .play': function(event, instance) {



            var synthParameters = getSynthParamsFromGui(instance);
            var chordMode;

            console.log(`synthpar `, synthParameters);

            if ($("#chord").prop("checked")) {
                chordMode = true;
            } else {
                chordMode = false;
            }

            instance.synthArray = playSynths(synthParameters, instance.synthType, chordMode);

        },

        'click .store': function(event, instance) {

          var synthParameters = getSynthParamsFromGui(instance);

          if ($("#chord").prop("checked")) {
              instance.chordmode = true;
          } else {
              instance.chordmode = false;
          }

          var storedParams = {};

          storedParams["synthParams"] = synthParameters;
          storedParams["chordmode"] = instance.chordmode;
          storedParams["synthtype"] = instance.synthType;

          console.log(`storedparams`, storedParams);

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
      var synthType = storedParams["synthtype"];

      console.log(`synthType `, synthType);

      instance.synthArray = playSynths(synthParameters, synthType, chordMode);
    }
  })

        });

        // helper funcs

        function getSynthParamsFromGui(instance){
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
          return synthParameters;
        }

        function playSynths(synthParameters, synthType, chordMode) {
          var synthArray = [];

          for (var element in synthParameters) {
            var params = synthParameters[element];
            console.log(`params4synth `, params);
            var synth = new Tone.Synth({
              "oscillator" : {
                "type" : synthType,
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

            synthArray.push([synth, Number(params["duration"]), Tone.Frequency.mtof(Number(params["midinote"]))]);
          }
          var when = Tone.now();
          var maxDur = 0.0;
          var start = when;
          for (var s in synthArray) {
            var synth = synthArray[s][0];
            var dur = synthArray[s][1];
            var note = synthArray[s][2];
            console.log(`when `, when);
            synth.triggerAttackRelease(note, dur, when);
            if(!chordMode) { when = when + dur; }
            if(dur > maxDur) {maxDur = dur};
          }

          // cleanup when done
          if((when - start) > maxDur) { maxDur = when - start; }
          setTimeout(function() {
            console.log("disposing");
            for (var s in synthArray) { synthArray[s][0].dispose(); }
          }, maxDur * 1500);// a little extra just in case

          return synthArray;
        }

        //This added section handles the keydown events along with relevant CSS class triggers for normal UI button behavior//
        document.onkeydown = keyMap

        function keyMap(e) {
          var key;
          var element;
          if (window.event)
           {key = window.event.keyCode;}
          else if (e)
           {key = e.which;}
          switch(key){
            case 49:
              element = document.getElementById("cell1");
              element.click();
              element.focus();
              setTimeout(function() {element.classList.add('active');}, 40);
              setTimeout(function() {element.classList.remove('active');}, 170);
              break;
            case 50:
              element = document.getElementById("cell2");
              element.click();
              element.focus();
              setTimeout(function() {element.classList.add('active');}, 40);
              setTimeout(function() {element.classList.remove('active');}, 170);
              break;
            case 51:
              element = document.getElementById("cell3");
              element.click();
              element.focus();
              setTimeout(function() {element.classList.add('active');}, 40);
              setTimeout(function() {element.classList.remove('active');}, 170);
              break;
            case 52:
              element = document.getElementById("cell4");
              element.click();
              element.focus();
              setTimeout(function() {element.classList.add('active');}, 40);
              setTimeout(function() {element.classList.remove('active');}, 170);
              break;
            case 53:
              element = document.getElementById("cell5");
              element.click();
              element.focus();
              setTimeout(function() {element.classList.add('active');}, 40);
              setTimeout(function() {element.classList.remove('active');}, 170);
              break;
            case 54:
              element = document.getElementById("cell6");
              element.click();
              element.focus();
              setTimeout(function() {element.classList.add('active');}, 40);
              setTimeout(function() {element.classList.remove('active');}, 170);
              break;
            case 55:
              element = document.getElementById("cell7");
              element.click();
              element.focus();
              setTimeout(function() {element.classList.add('active');}, 40);
              setTimeout(function() {element.classList.remove('active');}, 170);
              break;
            case 56:
              element = document.getElementById("cell8");
              element.click();
              element.focus();
              setTimeout(function() {element.classList.add('active');}, 40);
              setTimeout(function() {element.classList.remove('active');}, 170);
              break;
            case 57:
              element = document.getElementById("cell9");
              element.click();
              element.focus();
              setTimeout(function() {element.classList.add('active');}, 40);
              setTimeout(function() {element.classList.remove('active');}, 170);
              break;
          }
        }

};
