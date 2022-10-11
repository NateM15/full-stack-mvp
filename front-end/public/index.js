let dropdownVal = document.getElementById('dropdown');
let searchButton = document.getElementById('input');
let content = document.getElementById('contentContainer');
let caliber = document.getElementById('caliber');
let favPage = document.getElementById('fav');
let deleteValue = document.getElementById('deleteValue');
let deleteButton = document.getElementById('delete');
let topAmmo = document.getElementById('topAmmo');
let topAmmoName = document.getElementById('topThreeName');
let topAmmoEffective = document.getElementById('topThreeEffective');
let topAmmoUpdate = document.getElementById('topThreeUpdate');
let ammoDropdown = document.getElementById('ammoDropdown');
let homeButton = document.getElementById('home')
let selectedFav;
let divInfo;
let caliberInfo;
let divInfoContainer;
let checkSelector = false;
let favDiv;
var sendData;
let ammoInfo;

let URL = 'https://eft-ammo.onrender.com/api/';
let devURL = 'http://localhost:8001/api/';

homeButton.addEventListener('click', () => {
    content.innerHTML = ""
})
//Creates the page when the search button is clicked
searchButton.addEventListener('click', event => {
    content.innerHTML = ""
    if(dropdownVal.value === "Gun"){
        if (caliber.value === "all"){
            fetch(`${URL}guns`)
            .then((response) => response.json())
            .then((data) => {
                showGunData(data)
            })
        } else {
            fetch(`${URL}guns/gun/${caliber.value}`)
            .then((response) => response.json())
            .then((data) => {
                showGunData(data)
            })
        }

    } else {
        if (caliber.value === "all"){
            fetch(`${URL}ammo`)
            .then((response) => response.json())
            .then((data) => {
                showAmmoData(data)
            })
        } else {
            fetch(`${URL}ammo/search/${caliber.value}`)
            .then((response) => response.json())
            .then((data) => {
                showAmmoData(data)
            })
        }
    };
});

function addListener(button) {
    button.addEventListener('click', e => {
        if (e.target.classList.contains('contentDiv')) {

        } else {
            selectedFav = e.target.parentElement;
            sendData = {gun: `${selectedFav.children[0].textContent}`, caliber: `${selectedFav.children[1].textContent}`}
            console.log(sendData)

            fetch(`${URL}fav`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(sendData)
                })
                .then((response) => response)
                .then((data) => {
                    console.log('Success:', data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    })
}

favPage.addEventListener('click', () => {
    content.innerHTML = ""
    fetch(`${URL}fav/page`)
    .then((response) => response.json())
    .then((data) => {
        showFavorites(data)
    })
})

deleteButton.addEventListener('click', () => {
    let deleteBarValue = deleteValue.value
    if (!deleteBarValue){
        alert('Name of favorite you wish to delete')
    } else {
        fetch(`${URL}delete/${deleteBarValue}`,
        {method: 'DELETE'})
        .then(alert('Delete Succesful'))    
    }
})

topAmmo.addEventListener('click', () => {
    content.innerHTML = "";
    fetch(`${URL}topthree`)
    .then((response) => response.json())
    .then((data) => showTopThree(data))
});
topAmmoUpdate.addEventListener('click', () => {
    let ammoVal = ammoDropdown.value;
    let ammoName = topAmmoName.value;
    let ammoEff = topAmmoEffective.value;
    if (!ammoEff && !ammoName && Number.isInteger(ammoVal) === false){
        alert('Must have all info to update Top Three')
    } else {
        fetch(`${URL}topthree/patch/${ammoVal}`, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                name: `${ammoName}`,
                effective: `${ammoEff}`
            })
        })
        .then((response) => response)
        .then((data) => {
            console.log('Updated:', data)
        })
    }
})

//adds data to the page if they search by gun
function showGunData(data){
    for(let i = 0; i < data.length; i++){
        divCreation(data[i].gun_name, data[i].name)
    }
}
//adds data to the page if they search by ammo
function showAmmoData(data) {
    for(let i = 0; i < data.length; i++){
        ammoDivCreation(data[i].ammo_name, data[i].name, data[i].effective)
    }
};
function showFavorites(data) {
    for(let i = 0; i < data.length; i++){
        favDivCreation(data[i].gun_name, data[i].cal_name)
    }
}
function showTopThree(data) {
    for(let i = 0; i < data.length; i++){
        divCreation(data[i].name, data[i].effective)
    }
}
//creates the information that the user sees for gun requests
function divCreation(dataName, dataCaliber) {
    divInfoContainer = document.createElement('div')
    divInfoContainer.classList.add('contentDiv')
    divInfo = document.createElement('p');
    divInfo.textContent = `${dataName}`;
    divInfo.setAttribute('id','divInfo');
    caliberInfo = document.createElement('p');
    caliberInfo.textContent = `${dataCaliber}`;
    caliberInfo.setAttribute('id','calInfo');
    divInfoContainer.appendChild(divInfo);
    divInfoContainer.appendChild(caliberInfo);
    content.appendChild(divInfoContainer)
    let favButton = document.createElement('button')
    favButton.innerHTML = "Add to Favorites";
    favButton.classList.add('button');
    divInfoContainer.appendChild(favButton);
    addListener(favButton);
};
//creates the information that the user sees for ammo requests
function ammoDivCreation(dataName, dataEffective, dataCaliber) {
    divInfoContainer = document.createElement('div')
    divInfoContainer.classList.add('contentDiv')
    //creates name text
    divInfo = document.createElement('p');
    divInfo.textContent = `${dataName}`;
    divInfo.setAttribute('id','divInfo');
    //creates caliber text
    caliberInfo = document.createElement('p');
    caliberInfo.textContent = `${dataCaliber}`;
    caliberInfo.setAttribute('id','calInfo');
    //creates effective text
    ammoInfo = document.createElement('p');
    ammoInfo.textContent = `${dataEffective}`;
    ammoInfo.setAttribute('id','calInfo');

    divInfoContainer.appendChild(divInfo);
    divInfoContainer.appendChild(ammoInfo)
    divInfoContainer.appendChild(caliberInfo);
    content.appendChild(divInfoContainer)
    let favButton = document.createElement('button')
    favButton.innerHTML = "Add to Favorites";
    favButton.classList.add('button');
    divInfoContainer.appendChild(favButton);
    addListener(favButton);
};
//creates the information the user sees for their favorites
function favDivCreation(dataName, dataCaliber){
    divInfoContainer = document.createElement('div')
    divInfoContainer.classList.add('contentDiv')
    divInfo = document.createElement('h1');
    divInfo.textContent = `${dataName}`;
    divInfo.setAttribute('id','divInfo');
    caliberInfo = document.createElement('li');
    caliberInfo.textContent = `${dataCaliber}`;
    caliberInfo.setAttribute('id','calInfo');
    divInfoContainer.appendChild(divInfo);
    divInfoContainer.appendChild(caliberInfo);
    content.appendChild(divInfoContainer)
}
