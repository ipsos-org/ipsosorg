import { noUiSlider } from 'meteor/rcy:nouislider';
import specs from '../imports/specs.js';
import someSynths from '../client/gibber/synths.js';
import events from '../lib/events_v0/events.js';

//console.log(events.one['muons'].map(items => Object.keys(items)));

function selectEventVal(event){
    var getValues = events[event].muons.map(items => Object.values(items));
    Session.set('muons', getValues);
    return getValues;
};

selectEventVal('event_one');

if (Meteor.isClient) {
    Session.setDefault("slider", [1, 5]);
    Session.setDefault("currentEvent", 'event_one');
    
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

    function arrayVal(arrayIn) {
        if(arrayIn.constructor === String) {
            var array = Object.values(arrayIn);
            return array;
        }
    };

    function getOnlyNeed(input){
        var lookFor = ['frequency', 'gain', 'attack', 'decay']; //only this params will be available.
        var filter = input.filter(item => lookFor.includes(item));
        return filter;
    };

    function synthParams() {
        var params = someSynths[Session.get('synthID')];
        params = Object.keys(params);
        params = getOnlyNeed(params);
        return params;
    };

    function pushCurEventValToTable(){
        var curEvent = Session.get('muons');
        curEvent = [].concat.apply([], curEvent);
        return curEvent;
    };

    function pushCurEventKeyToTable(){
        var event = events['event_one'];
        var muons = event['muons'][0];
        muons = Object.keys(muons);
        console.log(muons.length);
        return muons;
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
            return synthParams();
        },
        getField(item, field){
            return item[field];
        },
        'getKeys': function(){
            return pushCurEventKeyToTable();
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
            console.log(selectedEvent);
        },
        'change #synth-select': function(event) {
            var selected = $(event.currentTarget).val();
            selected = Session.set('synthID', selected);
            console.log(Session.get('synthID'));
            synthParams();
        },
        'click button': function(event) {
            if(event.target.id == 'play'){
                seq.start();
            } else {
                seq.stop();
            }
        },
        'input input[type="range"]': function(event){
            Session.set(event.target.id, event.target.value);
        },
        'click #matrix-input': function(event, template){
            var selected = template.findAll("input[type=checkbox]:checked");
            var par = $(event.target).attr('class');
            var fieldValue = event.target.value;
            var modifier = { };
            if(par !== ""){
                if(_.contains (synthParams(), par)){
                    modifier = Session.get('synthID')[par] = specs[par]( Number(fieldValue) );
                    console.log(par + ':' + modifier);
                }
            }
        }
    });
};
