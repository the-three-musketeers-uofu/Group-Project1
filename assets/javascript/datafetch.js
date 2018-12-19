const request = require('request');
const firebase = require('firebase');

var config = {
    apiKey: "AIzaSyBPHhSRYxJURpaPX2Wr2BiPs6peZeJWQ1w",
    authDomain: "smogbegone-49e43.firebaseapp.com",
    databaseURL: "https://smogbegone-49e43.firebaseio.com",
    projectId: "smogbegone-49e43",
    storageBucket: "",
    messagingSenderId: "95406670846"
};
firebase.initializeApp(config);
var database = firebase.database();


function updateRecord(statid, statlat, statlon, stataqi) {


}


var options = {
    url: "https://www.purpleair.com/json",
    json: true,

};

function callback(error, response) {
    console.log(response.statusCode + " status code")
    //console.log(response.body)
    
    for(var i = 0; i < response.body.results.length; i++) {
        //console.log(response.body.results[i])
        if (response.body.results[i].DEVICE_LOCATIONTYPE === 'outside') {
            var statid1 = response.body.results[i].ID
            var statlat2 = response.body.results[i].Lat
            var statlon3 = response.body.results[i].Lon
            var stataqi4 = response.body.results[i].PM2_5Value
            if (stataqi4 < 50) {
                statcolor = "#00FF00"
            }
            else if (stataqi4 < 100 && stataqi4 > 50) {
                statcolor = "#FFFF00"
            }
            else {
                statcolor = "#FF0000"
            }
            database.ref('stations/' + statid1).set({
                id: statid1,
                lat: statlat2,
                lon: statlon3,
                aqi: stataqi4,
                color: statcolor,
                source: "purpleair",
            }); 
        
        }
    }

}
request.get(options, callback);


var options2 = {
    url: "http://www.airnowapi.org/aq/data/?parameters=PM25&BBOX=-175.388184,-63.652510,178.986816,83.651140&dataType=A&format=application/json&verbose=0&API_KEY=ACD0EF9E-23FE-47EC-AED1-9FC24134E5F0",
    json: true,

};

function callback2(error, response) {
    console.log(response.statusCode + " status code")
    //console.log(response.body[0].Latitude)
    
    for(var i = 0; i < response.body.length; i++) {
        //console.log(response.body)
      var statcolor = "";
      var statid1 = Math.floor(Math.abs(response.body[i].Latitude) + Math.abs(response.body[i].Longitude))
      var statlat2 = response.body[i].Latitude
      var statlon3 = response.body[i].Longitude
      var stataqi4 = response.body[i].AQI
      if (stataqi4 < 50) {
          statcolor = "#00FF00"
      }
      else if (stataqi4 < 100 && stataqi4 > 50) {
          statcolor = "#FFFF00"
      }
      else {
          statcolor = "#FF0000"
      }
      database.ref('stations/' + statid1).set({
                id: statid1,
                lat: statlat2,
                lon: statlon3,
                aqi: stataqi4,
                color: statcolor,
                source: "airnow",
            }); 
        
    }

}
request.get(options2, callback2);

setTimeout(function(){
    firebase.database().goOffline()
}, 15000);
