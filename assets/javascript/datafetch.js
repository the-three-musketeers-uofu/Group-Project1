const request = require('request');
const firebase = require('firebase');

var stationids = [];
var stataqi14 = "";
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
function aqiFormula(clow, chigh, ilow, ihigh, raw) {
    var calc1 = raw - clow;
    var calc2 = ihigh - ilow;
    var calc3 = chigh - clow;
    var calc4 = calc2 / calc3;
    var calc5 = calc4 * calc1;
    var calc6 = calc5 + ilow;
    return Math.floor(calc6);
}
function calculateAqi(rawaqi) {
    if (rawaqi >= 0 && rawaqi <= 12.1) {
        return aqiFormula(0.0, 12.0, 0, 50, rawaqi);
    }
    else if (rawaqi >= 12.1 && rawaqi <= 35.5) {
        return aqiFormula(12.1, 35.4, 51, 100, rawaqi);
    }
    else if (rawaqi >= 35.5 && rawaqi <= 55.5) {
        return aqiFormula(35.5, 55.4, 101, 150, rawaqi);
    }
    else if (rawaqi >= 55.5 && rawaqi <= 150.5) {
        return aqiFormula(55.5, 150.4, 151, 200, rawaqi);
    }
    else if (rawaqi >= 150.5 && rawaqi <= 250.5) {
        return aqiFormula(150.5, 250.4, 201, 300, rawaqi);
    }
    else if (rawaqi >= 250.5 && rawaqi <= 350.5) {
        return aqiFormula(250.5, 350.4, 301, 400, rawaqi);
    }
    else if (rawaqi >= 350.5 && rawaqi <= 500.5) {
        return aqiFormula(350.5, 500.4, 401, 500, rawaqi);
    }
    else {
        return "out of range"
    }
}
var options = {
    url: "https://www.purpleair.com/json",
    json: true,

};
function callback(error, response) {
    console.log(response.statusCode + " status code")
    //console.log(response.body.results.length)
    //console.log(response.body.results)

    for (var i = 0; i < response.body.results.length; i++) {
        //console.log(i);
        if (response.body.results[i].DEVICE_LOCATIONTYPE === 'outside' || response.body.results[i].DEVICE_LOCATIONTYPE === null && response.body.results[i].ParentID === null && response.body.results[i].PM2_5Value < 501) {
            if (response.body.results[i].Lat === null || response.body.results[i].Long === null) {
            }
            else {
                var statlat2 = response.body.results[i].Lat
                var statlon3 = response.body.results[i].Lon
                var tempid = response.body.results[i].ID
                var stataqitest = response.body.results[i].PM2_5Value
                stataqi14 = calculateAqi(stataqitest)
                //console.log(tempid)
                //console.log(stataqi14)
                var statid1 = generateId(statlat2, statlon3)
                if (stataqi14 < 50) {
                    statcolor = "#00FF00"
                }
                else if (stataqi14 < 100 && stataqi14 > 50) {
                    statcolor = "#FFFF00"
                }
                else {
                    statcolor = "#FF0000"
                }
                //console.log(stataqi14);
                database.ref('stations/' + statid1).set({
                    id: statid1,
                    lat: statlat2,
                    lon: statlon3,
                    aqi: stataqi14,
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
        // database.ref('/').set({
        // });
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