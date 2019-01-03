
var currentlocation = navigator.geolocation.getCurrentPosition(function (position) {
    var usercurrentlat = position.coords.latitude
    var usercurrentlon = position.coords.longitude
    mymap.setView([usercurrentlat, usercurrentlon], 10);
});
var mymap = L.map('mapid').setView([39.50, -98.35], 6);
var subStationArray = [];

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoidmFzaGVyeSIsImEiOiJjanA4eGFlcHEwMTk5M3ZtOGd1cDNvNGtpIn0.NTgjq3RtaFskoyWeOEB10A', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'your.mapbox.access.token'
}).addTo(mymap);

function onMapmove(e) {
    $(".leaflet-tooltip").remove();
    $(".leaflet-interactive").remove();

    if (mymap.getZoom() >= 9) {
        toprightlat = mymap.getBounds()._northEast.lat
        toprightlon = mymap.getBounds()._northEast.lng
        bottomleftlat = mymap.getBounds()._southWest.lat
        bottomleftlon = mymap.getBounds()._southWest.lng

        for (var i = 0; i < stationsarray.length; i++) {
            var split = stationsarray[i].split("_")
            var stationlat = split[0]
            var stationlon = split[1]
            var latrep = stationlat.replace(",", ".")
            var lonrep = stationlon.replace(",", ".")
            var latloncheck = checkBoundBox(toprightlat, toprightlon, bottomleftlat, bottomleftlon, lonrep, latrep)
            if (latloncheck === true) {
                database.ref('stations/' + stationsarray[i]).on('value', function (snapshot) {
                    var latValue = snapshot.val().lat
                    var longValue = snapshot.val().lon
                    var aqi = Math.floor(snapshot.val().aqi)
                    var colorValue = snapshot.val().color
                    var source = snapshot.val().source
                    var circle = L.circleMarker([], { color: colorValue, fill: true, fillOpacity: 1 })
                        .setLatLng([latValue, longValue])
                        .addTo(mymap);
                    circle.bindPopup(source + "<br>" + stationlat + ", " + stationlon)
                    var text = L.tooltip({
                        permanent: true,
                        direction: 'center',
                        className: 'text'
                    })
                        .setContent("" + aqi + "")
                        .setLatLng([latValue, longValue]);

                    text.addTo(mymap);

                })

            }
            else {
            }

        }


    }
    else {

    }



}


mymap.on('moveend', onMapmove);

function checkBoundBox(toprightlat, toprightlon, bottomleftlat, bottomleftlon, x, y) {
    if (toprightlon >= x && x >= bottomleftlon && toprightlat >= y && y >= bottomleftlat) {
        return true
    }
    else {
        return false
    }

}
var latValue = 39.3210
var longValue = -111.0937

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

stationsarray = [];
database.ref('stationlist/stationids').on('value', function (snapshot) {
    stationsarray = snapshot.val();

})

setTimeout(function () {

    // toprightlat = mymap.getBounds()._northEast.lat
    // toprightlon = mymap.getBounds()._northEast.lng
    // bottomleftlat = mymap.getBounds()._southWest.lat
    // bottomleftlon = mymap.getBounds()._southWest.lng
    // for (var i = 0; i < stationsarray.length; i++) {
    //     var split = stationsarray[i].split("_")
    //     var stationlat = split[0]
    //     var stationlon = split[1]
    //     var latrep = stationlat.replace(",", ".")
    //     var lonrep = stationlon.replace(",", ".")
    //     var latloncheck = checkBoundBox(toprightlat, toprightlon, bottomleftlat, bottomleftlon, lonrep, latrep)
    //     if (latloncheck === true) {
    //         database.ref('stations/' + stationsarray[i]).on('value', function (snapshot) {
    //             var latValue = snapshot.val().lat
    //             var longValue = snapshot.val().lon
    //             var aqi = Math.floor(snapshot.val().aqi)
    //             var colorValue = snapshot.val().color
    //             var circle = L.circleMarker([], { color: colorValue, fill: true, fillOpacity: 1 })
    //                 .setLatLng([latValue, longValue])
    //                 .addTo(mymap);
    //             var text = L.tooltip({
    //                 permanent: true,
    //                 direction: 'center',
    //                 className: 'text'
    //             })
    //                 .setContent("" + aqi + "")
    //                 .setLatLng([latValue, longValue]);
    //             text.addTo(mymap);
    //         })
    //     }
    //     else {
    //     }
    // }
}, 1000);

