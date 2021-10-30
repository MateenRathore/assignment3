
// Map
let attribution = "&copy <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors";
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'; 
let tiles = L.tileLayer(tileUrl, { attribution });
let mymap = L.map('mapid').setView([50,20], 2);

let setpatientlocation = (lat, long,text)=>{
    let Marker=L.marker([0,0]).addTo(mymap);
    // Set africa location marker
    Marker.setLatLng([lat,long]);
    Marker.bindPopup(text);
    tiles.addTo(mymap);
}