import { noUiSlider } from 'meteor/rcy:nouislider';
import specs from '../imports/specs.js';
import someSynths from '../client/gibber/synths.js';

let json = require('../lib/ev119516329_run199318.json');
event = json['muons'];
Data = new Mongo.Collection('data', { connection: null });
const array = event.map( item => JSON.stringify(item) );
const selected = [];

if (Meteor.isClient) {

    Session.setDefault("slider", [1, 5]);
    Session.setDefault('selected', Data.find().fetch());
    
    function normalize(val, max=1, min=0.1) {
        return (val - min) / (max - min);
    };

    function normalize_scale_offset(input, scale=1, offset=0) {
        var normalized = input.map((val) => normalize(val, Math.max(...input), Math.min(...input)));
        return normalized.map( (val) => val / scale + Math.sqrt(offset) ).map((val) => val * 1000);
    };

    function arrayVal(arrayIn) {
        if(arrayIn.constructor === String) {
            var array = JSON.parse(arrayIn);
            array = Object.values(array);
            return array;
        }
    };

    Meteor.startup(function (){
        if(Data.find().count() === 0) {
            console.log("importing data to db");
            var data = json['muons'];
            data = data.forEach(items => Data.insert(items));
            console.log(data);
        }
    });

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

    Template.ipsosboard.helpers({
        'categories': function() {
            return array;

        },
        'dataItems': function(){
            return Session.get('selected'); //reading from db.
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
            return Session.get('keys');
        }
    });

    Template.ipsosboard.events({
        "change #category-select": function(event, template) {
            var selectedArray = $( event.currentTarget ).val();
            Session.set('keys', Object.keys(selectedArray));
            console.log(selectedArray);
            selectedArray = arrayVal(selectedArray);
            Session.set('selected', selectedArray);
            //seq.values = normalize_scale_offset(selectedArray, Session.get('slider')[0], Session.get('slider')[1]);
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
            //seq.timings = [44100, 44100].map(val => val / Session.get('speed'));
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
