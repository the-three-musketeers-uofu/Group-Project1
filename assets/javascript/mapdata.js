
var currentlocation = navigator.geolocation.getCurrentPosition(function (position) {
    var usercurrentlat = position.coords.latitude
    var usercurrentlon = position.coords.longitude
    mymap.setView([usercurrentlat, usercurrentlon], 10);
});
var mymap = L.map('mapid').setView([39.50, -98.35], 3);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoidmFzaGVyeSIsImEiOiJjanA4eGFlcHEwMTk5M3ZtOGd1cDNvNGtpIn0.NTgjq3RtaFskoyWeOEB10A', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'your.mapbox.access.token'
}).addTo(mymap);

function checkBoundBox(toprightlat, toprightlon, bottomleftlat, bottomleftlon, x, y) {
    if (toprightlon >= x && x >= bottomleftlon && toprightlat >= y && y >= bottomleftlat) {
        return true
    }
    else {
        return false
    }

}

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
                database.ref('stations/' + stationsarray[i]).once('value', function (snapshot) {
                    var bordercolor = "";
                    var latValue = snapshot.val().lat
                    var longValue = snapshot.val().lon
                    var aqi = Math.floor(snapshot.val().aqi)
                    var colorValue = snapshot.val().color
                    var source = snapshot.val().source
                    if (source === 'purpleair') {
                        bordercolor = 'purple'
                    }
                    else {
                        bordercolor = 'blue'
                    }
                    var circle = L.circleMarker([], { stroke: true, color: bordercolor, fillColor: colorValue, fillOpacity: 1, weight: 3 })
                        .setLatLng([latValue, longValue])
                        .addTo(mymap);
                    circle.bindPopup("Data Source: " + source + "<br>" + "<button type='button' id='" + latrep + "," + lonrep + "' class='btn btn-primary' data-toggle='modal' data-target='#exampleModal' test='test'>sign up for notifications</button>")
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

L.Control.Watermark = L.Control.extend({
    onAdd: function(map) {
        var img = L.DomUtil.create('img');

        img.src = 'assets/images/legend.png';
        img.style.width = '200px';
        img.style.height = '153px';

        return img;
    },

    onRemove: function(map) {
        // Nothing to do here
    }
});

L.control.watermark = function(opts) {
    return new L.Control.Watermark(opts);
}

L.control.watermark({ position: 'bottomleft' }).addTo(mymap);



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

$( "#submitbutton" ).click(function() {
    var name = $('#name').val();
    var email = $('#email').val();
    var comments = $('#comments').val();
    $('#name').val('');
    $('#email').val('');
    $('#comments').val('');
    (function(){
        emailjs.init("user_dLIBicRVniGXl3AqR13PS");
     })();
    var templateParams = {
        from_name: name,
        from_email: email,
        message_html: comments,
    };
     
    emailjs.send('gmail', 'template_wnYao22B', templateParams)
        .then(function(response) {
           console.log('SUCCESS!', response.status, response.text);
        }, function(error) {
           console.log('FAILED...', error);
        });
  });