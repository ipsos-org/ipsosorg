import { noUiSlider } from 'meteor/rcy:nouislider';

let json = require('../lib/ev119516329_run199318.json');
event = json['muons'];
Data = new Mongo.Collection('data', { connection: null });
const array = event.map( item => JSON.stringify(item) );
const selected = new Array();
const synthArray = new Array('saw', 'pulse', 'sine');

if (Meteor.isClient) {

    Session.setDefault("slider", [1, 5]);
   // Session.setDefault('synthID', eval('saw'));
    Session.setDefault('synthProperties', [' ', 'amp','freq','mod']);
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
        } else {
            console.log("input is not array", arrayIn);
            alert(typeof arrayIn);
        };
    };

 Meteor.startup(function (){
        if(Data.find().count() === 0) {
            console.log("importing data to db");
            var data = json['muons']; //muons is an array of objects.
            data = data.forEach(items => Data.insert(items));
            console.log(data);
        };
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
            seq.values = setValues;
            //console.log(val);
        });
    };

    function synthParams() {
        var params = Object.keys(eval(Session.get('synthID')));
        Session.set('synthProperties', params);
        console.log(Session.get('synthProperties'));
        return params;
    }

    Template.ipsosboard.helpers({
        'categories': function() {
            return array; //reading from JSON file.
        },
        'dataItems': function(){
            return Session.get('selected'); //reading from db.
        },
        'synths': function() {
            return synthArray; //synths of the app.
        },
        'slider': function () {
            return Session.get("slider");
        },
        'listParams': function () {
            return Session.get('synthProperties');
        },
        getField(item, field){
            return item[field];
        }
    });

    Template.ipsosboard.events({
        "change #category-select": function(event, template) {
            var selectedArray = $( event.currentTarget ).val();
            selectedArray = arrayVal(selectedArray);
            Session.set('selected', selectedArray);
            console.log(selectedArray);
           seq.values = normalize_scale_offset(selectedArray, Session.get('slider')[0], Session.get('slider')[1]);
        },
        'change #synth-select': function(event) {
            var selected = $(event.currentTarget).val();
            Session.set('synthID', selected);
            seq.target = eval(selected);
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
            seq.timings = [11025, 11025].map(val => val / Session.get('speed'));
        },

        'click #matrix-input': function(event, template){
            //event.preventDefault();
            var selected = template.findAll("input[type=checkbox]:checked");
            var label = $(event.target).attr('class');
            var array = _.map(selected, function(item){
                var modifier = {};
                return item.defaultValue;
            });
            var modifier = {};
            modifier[label] = Number(event.target.value);
            console.log(modifier);
        }
         /*   if(checked){
                console.log(event.target);
            } else {
                selected.splice($.inArray(event.target.value, selected), 1);
            };
           // if( Array.isArray(selected) && selected.length > 1 ){ //the sequencer will keep the last two values when less than two are checked
            seq.values = normalize_scale_offset(selected, Session.get('slider')[0], Session.get('slider')[1]);
            console.log(selected);
        }*/
    });

}; //end of client code.

if (Meteor.isServer) {
    //code to run on server.
};

// TODO: Add a matrix to map data with parameters.
