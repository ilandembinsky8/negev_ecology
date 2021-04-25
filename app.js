// Use SWAGER in the following link to see the API:
//    http://35.225.168.44:8080/swagger-ui/index.html?configUrl=/v3/api-docs/swagger-config

function getAllTrucks() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://35.225.168.44:8080/trucks", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("token"));
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = this.responseText;
            var obj = JSON.parse(response);
            console.log(obj);
            var result = obj[0].name;
            console.log(result);
            var x, txt = "";
            // var person = {name:"John", age:50, city:"New York"};

            for (x in obj) {
              for (i in x){
                txt +=
                 "</br>"+"<b>Truck Number</b>"+" " +x[i]+"</br>"+"</br>"+"<b>Truck Name:</b>"+" "+obj[x[i]].name +
                 "</br>"+"<b>Status:</b>"+" "+obj[x[i]].status+
                 "</br>"+"<b>Created At:</b>"+" "+obj[x[i]].createdAt+
                 "</br>"+"<b>IMEI:</b>"+" "+ obj[x[i]].imei+
                 "</br>"+"<b>Truck Number:</b>"+" "+ obj[x[i]].truckNumber+"</br>";
              };

          };
            document.getElementById("trucks").innerHTML = txt;
        }
    };
    var data = {};
    xhttp.send(JSON.stringify(data));
}
function getTruckByNumber() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://35.225.168.44:8080/trucks/by-truck-number/"+document.getElementById('truckNumInput').value, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("token"));
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = this.responseText;
            var obj = JSON.parse(response);
            console.log(obj);
            // var result = obj[0].name;
            // console.log(result);
            var txt = "<b>Created At:</b>"+" "+obj.createdAt + "<br>"+
                      "<b>Updated At:</b>"+" "+obj.updatedAt + "<br>"+
                      "<b>IMEI:</b>"+" "+obj.imei + "<br>"+
                      "<b>Name:</b>"+" "+obj.name + "<br>"+
                      "<b>Status:</b>"+" "+obj.status + "<br>"+
                      "<b>Truck Id:</b>"+" "+obj.truckId + "<br>"+
                      "<b>Truck Number:</b>"+" "+obj.truckNumber + "<br>"+
                      "<b>Last Update:</b>"+" "+obj.lastUpdate + "<br>";
            document.getElementById("trucks").innerHTML = txt;
        }
    };
    var data = {};
    xhttp.send(JSON.stringify(data));
}

// Function getTruckAndContainer:
//
// The HTTP GET request is: /history/by-truck-id/{truckId}/all
// JSON Response example we get by this method:
// [
//   { "createdAt":"2021-01-26T08:45:49.000+00:00",
//     "updatedAt":"2021-01-26T08:45:49.000+00:00",
//     "statusId":"15f4057d-3dbc-4675-8651-215466c90cc0",
//     "truck":{"truckId":"582ea8ad-7f4e-4aa3-9e81-34d8c1336520","truckNumber":"30917501"},
//     "container":{"containerId":8,"containerNumber":"855","beaconHardwareName":"AC233F692CA9","containerName":"MINEW 8","containerSize":"large","beaconInstanceId":"000000000008"},"latitude":31.3633283,"longitude":34.7209533,"altitude":198.0,"fixTime":"2020-12-22T03:01:12.000+00:00","deviceTime":"2020-12-22T03:01:12.000+00:00",
//     "serverTime":"2020-12-22T10:13:44.000+00:00",
//     "status":"CONNECTED"
//   },
//   ...
// ]
function getTruckAndContainer(){
  
  //Creates AJAX object
  var xhttp = new XMLHttpRequest();
  var url = "http://35.225.168.44:8080/history/by-truck-id/582ea8ad-7f4e-4aa3-9e81-34d8c1336520/all";
  xhttp.open("GET", url, true);
  
  // Sends request header to ask for JSON response
  xhttp.setRequestHeader("Content-Type", "application/json");
  // Gets from local storage the token we received from the server
  // when we send to the server a login requerst (with username and password).
  var token = localStorage.getItem("token");
  xhttp.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("token"));
  
  // Defines the function which AJAX will call when it receives
  // response from server.
  xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
          var response = this.responseText;
          //console.log("Received response:\n" + response);
         var history = JSON.parse(response);
         
          var index=0;
          const GOOD_HISTORY_START = 48;
          const GOOD_HISTORY_END = 53;
          for (var i=GOOD_HISTORY_START; i<GOOD_HISTORY_END; i++ ){

              if ( history[i].status != "CONNECTED" &&
                   history[i].status != "DISCONNECTED" )
              {     
                  continue;
              }

              var result = 
                  { 
                      truckNum: history[i].truck.truckNumber,
                      containerId: history[i].container.containerId,
                      updatedAt: history[i].updatedAt,
                      latitude: history[i].latitude,
                      longitude: history[i].longitude,
                      status: history[i].status
                  };
              console.log("History Result:\n", result);

              var txt = "<b>truck Num:</b>"+" "+result.truckNum + "<br>"+
                          "<b>container Id:</b>"+" "+result.containerId + "<br>"+
                          "<b>UpdateAt:</b>"+" "+result.updatedAt + "<br>"+
                          "<b>latitude:</b>"+" "+result.latitude + "<br>" +
                          "<b>longitude:</b>"+" "+result.longitude + "<br>" +
                          "<b>Status:</b>"+" "+result.status + "<br>";
                          
              document.getElementById("trucks").innerHTML += txt;

              initMap(result.latitude, result.longitude);

              return;
          };

          return;
          
      }
  };

  xhttp.send();

}
 // it's working but without the need of a token

function makeLogin1() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://35.225.168.44:8080/login", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.onreadystatechange = function () {
        console.log(this.readyState);
        if (this.readyState == 4 && this.status == 200) {
            var response = this.responseText;
            var obj = JSON.parse(response);
            localStorage.setItem("token", obj.idToken);
        }
    };
    var data = { email: 'ilan@berger-sisters.co.il', password: 'ilan1234' };
    xhttp.send(JSON.stringify(data));
}

// Initialize and add the map
/*function initMap(latitude, longitude) {
  // The location of Uluru
  //const marker1 = { lat: 31.791, lng: 34.640 };
  const marker1 = { lat: latitude, lng: longitude };
  const marker2 = { lat:31.23995400503557,lng:34.794462560705064};
  // The map, centered at Uluru
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 8,
    center:marker1,
  });
  // The marker, positioned at Uluru
  const marker = new google.maps.Marker({
    position:marker1,
   title:"hallo people",
   map: map,
 });
 const marker3 = new google.maps.Marker({
    position:marker2,
   title:"Bye people",
   map: map,
 });
  setMarkers(map);
  
}*/
function initMap(latitude, longitude) {
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 8,
      center: { lat:latitude, lng:  longitude },
    });
    setMarkers(map);
  }
  // Data for the markers consisting of a name, a LatLng and a zIndex for the
  // order in which these markers should display on top of each other.
  const beaches = [
    ["Truck-1", 31.832207701859772, 35.11518841612261, 4],
    ["Truck-2", 31.863412799582193,34.79368226838407, 5],
    ["Truck-3",31.23995400503557, 34.794462560705064, 3],
    ["Truck-4", 31.67518715495122,34.6235929386969, 2],
    ["Truck-5", 31.9633233,  34.74095, 1],
  ];
  function setMarkers(map) {
    const shape = {
      coords: [1, 1, 1, 20, 18, 20, 18, 1],
      type: "poly",
    };
  
    for (let i = 0; i < beaches.length; i++) {
      const beach = beaches[i];
      new google.maps.Marker({
        position: { lat: beach[1], lng: beach[2] },
        map,
        shape: shape,
        title: beach[0],
        zIndex: beach[3],
      });
    }
  }
src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDiWOzJin0irzYKx8q8DQQSi9MP4hQ1P0c&callback=initMap&libraries=&v=weekly"

