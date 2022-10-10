let dropdownVal = document.getElementById('dropdown');
let searchButton = document.getElementById('input');
let content = document.getElementById('contentContainer');
let caliber = document.getElementById('caliber');



searchButton.addEventListener('click', event => {
    console.log(dropdownVal.value)
    console.log(caliber.value)
    if(dropdownVal.value === "Gun"){
        fetch(`http://localhost:8001/guns/gun/${caliber.value}`)
            .then((response) => response.json())
            .then((data) => showGunData(data))
    } else {
        fetch(`http://localhost:8001/ammo/${caliber.value}`)
        .then((response) => response.json())
        .then((data) => showAmmoData(data))
    }
})

function showGunData(data){
    for(let i = 0; i < data.length; i++){
        divCreation(data[i].gun_name, data[i].name)
    }
}
function showAmmoData(data) {
    for(let i = 0; i < data.length; i++){
        divCreation(data[i].ammo_name, data[i].name)
    }
}

function divCreation(dataGun, dataCaliber) {
    let gunInfo = document.createElement('h1');
    gunInfo.textContent = `${dataGun}`;
    let caliberInfo = document.createElement('li');
    caliberInfo.textContent = `${dataCaliber}`;
    content.appendChild(gunInfo);
    content.appendChild(caliberInfo);
}