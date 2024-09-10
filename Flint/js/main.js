let MAP;
let MAPPINCOORD;
let INITMAPLOC = { lat: 43.0202, lng: -83.6935 };
let MAPADDRESS;
let MAPLEAD;
let coordData, leadData, addressData;
let numCoords, numLead, numAddress;

let launched = false;

// GET HTML ELEMENTS
let addressLabel = document.getElementById("addressLabel");
let leadLabel1 = document.getElementById("leadLabel1");
let leadLabel2 = document.getElementById("leadLabel2");
let results = document.getElementById("results");

// get data

function processAddressRow(row){
    row.ParIDPack = +row.ParIDPack;
    let res = {
        'pid' : row.ParIDPack,
        'address' : row.ADDRESS};
    return res;
}

let addresses = [];

addresses.push(d3.csv("data/flint_address_data.csv", row =>processAddressRow(row)));
Promise.all(addresses)
    .then(function (data){
        console.log(data[0]);
        addressData = data[0];
        numAddress = data[0].length;
    });

function processLeadRow(row){
    row.pid = +row.pid;
    row.dangerous = +row.dangerous;
    let res = {
        'pid' : row.pid,
        'lead' : row.dangerous};
    return res;
}

let lead = [];

lead.push(d3.csv("data/flint_lead_data.csv", row =>processLeadRow(row)));
Promise.all(lead)
    .then(function (data){
        console.log(data[0]);
        leadData = data[0];
        numLead = data[0].length;
    });


function processCoordRow(row){
    row.pid = +row.pid;
    row.Latitude = +row.Latitude;
    row.Longitude = +row.Longitude;
    let res = {
        'pid' : row.pid,
        'lat' : row.Latitude,
        'lon' : row.Longitude};
    return res;
}

let coords = [];

coords.push(d3.csv("data/flint_coord_data.csv", row =>processCoordRow(row)));
Promise.all(coords)
    .then(function (data){
        console.log(data[0]);
        coordData = data[0];
        numCoords = data[0].length;
    });


// load new address
$('.load-map').on('click',function(){
    getNewAddress();
});


function getNewAddress(){

    if (!launched){
        launched = true;
        results.style.display = "block";
    }

    let leadidx = Math.round(Math.random()*numLead);

    MAPLEAD = leadData[leadidx]['lead'] == 1;
    let pid = leadData[leadidx]['pid'];

    // get address based on pid
    for (let i = 0; i < numAddress; i++){
        if (addressData[i]['pid'] == pid){
            MAPADDRESS = addressData[i]['address'];
        }
    }

    // get lat/lon based on pid
    for (let i = 0; i < numCoords; i++){
        if (coordData[i]['pid'] == pid){
            MAPPINCOORD = { lat: coordData[i]['lat'], lng: coordData[i]['lon'] };
        }
    }

    addressLabel.innerText = "Address: " + MAPADDRESS;
    let leadAnswer = MAPLEAD ? "  Yes" : "  No";
    leadLabel1.innerText = "Showed prominent lead levels?   ";
    leadLabel2.innerText = leadAnswer;

    MAP = new google.maps.Map(document.getElementById("map"), {
        zoom: 13,
        center: MAPPINCOORD,
    });
    const marker = new google.maps.Marker({
        position: MAPPINCOORD,
        map: MAP,
    });
}


function initMap() {
    MAP = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: INITMAPLOC,
    });
}

window.initMap = initMap;
