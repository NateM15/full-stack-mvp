let dropdownVal = document.getElementById('dropdown');
let searchButton = document.getElementById('input');
let content = document.getElementById('contentContainer');
let caliber = document.getElementById('caliber');
let addFav = document.getElementById('addFavorite');
let favPage = document.getElementById('fav');
let deleteValue = document.getElementById('deleteValue');
let deleteButton = document.getElementById('delete');
let topAmmo = document.getElementById('topAmmo');
let topAmmoName = document.getElementById('topThreeName');
let topAmmoEffective = document.getElementById('topThreeEffective');
let topAmmoUpdate = document.getElementById('topThreeUpdate');
let ammoDropdown = document.getElementById('ammoDropdown');
let selectedFav;
let divInfo;
let caliberInfo;
let divInfoContainer;
let checkSelector = false;
let favDiv;

//Creates the page when the search button is clicked
searchButton.addEventListener('click', event => {
    content.innerHTML = ""
    if(dropdownVal.value === "Gun"){
        fetch(`http://localhost:8001/api/guns/gun/${caliber.value}`)
            .then((response) => response.json())
            .then((data) => {
                showGunData(data)
            })
    } else {
        fetch(`http://localhost:8001/api/ammo/${caliber.value}`)
        .then((response) => response.json())
        .then((data) => {
            showAmmoData(data)
        })
    };
});

function addListener(div) {
    div.addEventListener('click', e => {
        // if (checkSelector == false){
        //     checkSelector = true
        // } else {
        //     checkSelector = false
        // }
        // console.log(checkSelector)
        if (e.target.classList.contains('contentDiv')) {

        } else {
            selectedFav = e.target.parentElement;
            addFav.addEventListener('click', () => {
                var sendData = {gun: `${selectedFav.children[0].textContent}`, caliber: `${selectedFav.children[1].textContent}`}
                console.log(sendData)
                fetch('http://localhost:8001/api/fav', {
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
            })
        };
    })
}

favPage.addEventListener('click', () => {
    content.innerHTML = ""
    fetch('http://localhost:8001/api/fav/page')
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
        fetch(`http://localhost:8001/api/delete/${deleteBarValue}`,
        {method: 'DELETE'})
        .then(alert('Delete Succesful'))    
    }
})

topAmmo.addEventListener('click', () => {
    content.innerHTML = "";
    fetch('http://localhost:8001/api/topthree')
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
        fetch(`http://localhost:8001/api/topthree/patch/${ammoVal}`, {
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
        divCreation(data[i].ammo_name, data[i].name)
    }
};
function showFavorites(data) {
    for(let i = 0; i < data.length; i++){
        divCreation(data[i].gun_name, data[i].cal_name)
    }
}
function showTopThree(data) {
    for(let i = 0; i < data.length; i++){
        divCreation(data[i].name, data[i].effective)
    }
}
//creates the information that the user sees
function divCreation(dataName, dataCaliber) {
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
    addListener(divInfoContainer)
};

