/*
[{"date": "2/1","place_name": "테스트 장소","type_name": "0번재 확진자","latlng": "{\"lat\":37.499633, \"lng\":127.094559}"}],[{"date": "2/1","place_name": "테스트 장소","type_name": "0번재 확진자","latlng": "{\"lat\":37.517161, \"lng\":127.099494}"}]
*/
window.onload = () => {
    const scene = document.querySelector('a-scene');

    // first get current user location
    return navigator.geolocation.getCurrentPosition(function (position) {

        // then use it to load from remote APIs some places nearby
        fetch('/js/metadata')
        .then(function(response) {
          return response.json();
        })
        .then(function(myJson) {
          console.log(JSON.stringify(myJson));
          return myJson;
        }).then((people) => {
                people.forEach((places) => {
                    places.forEach((place) => {
                        var latlng = JSON.parse(place.latlng);

                        if(!latlng.lat || !latlng.lng ) return true;

                        const latitude = latlng.lat;
                        const longitude = latlng.lng;
                        
                        //if(computeDistance(position.coords,latitude,longitude) > 1000) return true;

                        // add place icon
                        const icon = document.createElement('a-image');
                        icon.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude}`);
                        icon.setAttribute('place_name', place.place_name);
                        if(place.type_name){
                          icon.setAttribute('type_name', place.type_name);
                        }
                        else{
                          icon.setAttribute('type_name', place.full_name);
                        }
                        icon.setAttribute('src', '/assets/map-marker.png');
                        icon.setAttribute('distance-check','');

                        // for debug purposes, just show in a bigger scale, otherwise I have to personally go on places...
                        icon.setAttribute('scale', '10 10 10');

                        icon.addEventListener('loaded', () => window.dispatchEvent(new CustomEvent('gps-entity-place-loaded')));
                        
                        const clickListener = function(ev) {
                            
                            ev.stopPropagation();
                            ev.preventDefault();

                            const type_name = ev.target.getAttribute('type_name');
                            const place_name = ev.target.getAttribute('place_name');
                            const dist = ev.target.getAttribute('distance')
                            const el = ev.detail.intersection && ev.detail.intersection.object.el;

                            if (el && el === ev.target) {
                                const label = document.createElement('span');
                                const container = document.createElement('div');
                                container.setAttribute('id', 'place-label');
                                label.innerText = type_name+" 동선\n"+place_name+"\n"+Math.round(dist)+"m 앞";
                                container.appendChild(label);
                                document.body.appendChild(container);

                                setTimeout(() => {
                                    container.parentElement.removeChild(container);
                                }, 5000);
                            }
                        };

                        icon.addEventListener('click', clickListener);
                        
                        scene.appendChild(icon);
                    });
                });
                console.log(people.length+"명 위치 Camera Map 에 표시 완료");
            })
    },
        (err) => console.error('Error in retrieving position', err),
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 27000,
        }
    );
};

function computeDistance(startCoords, destlat, destlng) {
    var startLatRads = degreesToRadians(startCoords.latitude);
    var startLongRads = degreesToRadians(startCoords.longitude);
    var destLatRads = degreesToRadians(destlat);
    var destLongRads = degreesToRadians(destlng);

    var Radius = 6371; //지구의 반경(km)
    var distance = Math.ceil(Math.acos(Math.sin(startLatRads) * Math.sin(destLatRads) + 
                    Math.cos(startLatRads) * Math.cos(destLatRads) *
                    Math.cos(startLongRads - destLongRads)) * Radius * 1000);

    return distance;
};

function degreesToRadians(degrees) {
    radians = (degrees * Math.PI)/180;
    return radians;
};

function radiansToDegrees(radians) {
    degrees = (radians * 180)/Math.PI;
    return degrees;
};

function calcAngleDegrees(x, y) {
    angle = Math.atan2(y, x) * 180 / Math.PI;
    if(angle < 0 ) angle += 360;
    return angle;
};

function calcDistance(positionA , positionB) {
    dist_x = positionA.x-positionB.x;
    dist_y = positionA.y-positionB.y;
    dist_z = positionA.z-positionB.z;
    dist = Math.sqrt(Math.pow(dist_x,2)+Math.pow(dist_y,2)+Math.pow(dist_z,2));

    return dist;
};

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
