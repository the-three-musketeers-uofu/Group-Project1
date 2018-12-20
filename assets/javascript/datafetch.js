const request = require('request');
const firebase = require('firebase');
var stationids = [];
var config = {
    apiKey: "AIzaSyAY3Wlf5kF5TAShX0p4dFW2drTbCgYuh5Q",
    authDomain: "smogbegone-b3044.firebaseapp.com",
    databaseURL: "https://smogbegone-b3044.firebaseio.com",
    projectId: "smogbegone-b3044",
    storageBucket: "smogbegone-b3044.appspot.com",
    messagingSenderId: "1003431858350"
};
firebase.initializeApp(config);
var database = firebase.database();
function updateRecord(statid, statlat, statlon, stataqi) {
}
function generateId(latitudein, Longitudein) {
    var latset = latitudein.toString()
    var lonset = Longitudein.toString()
    var latrep = latset.replace(".", ",")
    var lonrep = lonset.replace(".", ",")
    var finalname = latrep + "_" + lonrep
    return finalname

}
var options = {
    url: "https://www.purpleair.com/json",
    json: true,

};
function callback(error, response) {
    console.log(response.statusCode + " status code")

    for (var i = 0; i < response.body.results.length; i++) {
        if (response.body.results[i].DEVICE_LOCATIONTYPE === 'outside') {
            if (response.body.results[i].Lat === null || response.body.results[i].Long === null) {
            }
            else {
                var statlat2 = response.body.results[i].Lat
                var statlon3 = response.body.results[i].Lon
                var stataqi4 = response.body.results[i].PM2_5Value
                var statid1 = generateId(statlat2, statlon3)
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
}
request.get(options, callback);

var options2 = {
    url: "http://www.airnowapi.org/aq/data/?parameters=PM25&BBOX=-175.388184,-63.652510,178.986816,83.651140&dataType=A&format=application/json&verbose=0&API_KEY=ACD0EF9E-23FE-47EC-AED1-9FC24134E5F0",
    json: true,

};
function callback2(error, response) {
    console.log(response.statusCode + " status code")
    //console.log(response.body[0].Latitude)

    for (var i = 0; i < response.body.length; i++) {

        var statlat2 = response.body[i].Latitude
        var statlon3 = response.body[i].Longitude
        var stataqi4 = response.body[i].AQI
        var statid1 = generateId(statlat2, statlon3)
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
database.ref("stations/").on("child_added", function (snapshot) {
    var stationid = snapshot.val().id;
    stationids.push(stationid);
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});
setTimeout(function () {
    database.ref('stationlist/').set({
        stationids
    });
}, 10000);
setTimeout(function () {
    firebase.database().goOffline()
}, 20000);