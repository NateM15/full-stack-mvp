//Line 2-21 creates variables for dom manipulation
let dropdownVal = document.getElementById('dropdown');
let searchButton = document.getElementById('input');
let content = document.getElementById('contentContainer');
let caliber = document.getElementById('caliber');
let favPage = document.getElementById('fav');
let topAmmo = document.getElementById('topAmmo');
let topAmmoName = document.getElementById('topThreeName');
let topAmmoCaliber = document.getElementById('topThreeCaliber');
let topAmmoEffective = document.getElementById('topThreeEffective');
let topAmmoUpdate = document.getElementById('topThreeUpdate');
let ammoDropdown = document.getElementById('ammoDropdown');
let homeButton = document.getElementById('home')
let topAmmoContainer = document.getElementById('topAmmoContainer')
let selectedFav;
let divInfo;
let caliberInfo;
let divInfoContainer;
let favDiv;
var sendData;
let ammoInfo;

//URL's for fetch request, URL is live, devURL is for local dev testing.
let URL = 'https://eft-ammo.onrender.com/api/';
//let devURL = 'http://localhost:8001/api/';

//Hides the top three ammo update bar until in the top ammo menu, it is populated when top ammo is pressed
topAmmoContainer.style.display = 'none';

//Home button
//Empties the container to return to the home page
homeButton.addEventListener('click', () => {
    content.innerHTML = ""
    topAmmoContainer.style.display = 'none';
})

//Search Button Functionallity
//Populates the information from the fetch request when user presses the search button.
//Results are dependent on the information in the drop down menu.
searchButton.addEventListener('click', event => {
    //Clears the container so old information is removed and new info is populated
    content.innerHTML = ""
    //Hides the top ammo update bar if the user navigates from top ammo straight into search
    topAmmoContainer.style.display = 'none';
    //Populates information based on the Gun dropdown
    if(dropdownVal.value === "Gun"){
        if (caliber.value === "All"){
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
        //Populates information based on the ammo dropdown
        if (caliber.value === "All"){
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

//Creates Add Favorite Button
//Adds the funcitonallity of the add favorite button **Note** Rename the function
function addListener(button) {
    button.addEventListener('click', e => {
        //Old feature, due removal
        if (e.target.classList.contains('contentDiv')) {

        } else {
            //Gets information from the div that the add to favorites button was pressed in
            selectedFav = e.target.parentElement;
            /**Note: Refactor front end and back end to support both guns and ammo favorites**/
            sendData = {gun: `${selectedFav.children[0].textContent[1]}`, caliber: `${selectedFav.children[1].textContent[4]}`}
            console.log(sendData)
            //Adds the information into the favorites table
            fetch(`${URL}fav`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(sendData)
                })
                .then((response) => response)
                .then((data) => {
                    alert(`${selectedFav.children[0].textContent} Added to Favorites!`)
                    console.log('Success:', data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    })
};

//Show Favorites Page
//Allows the user to navigate to their favorites and populates the information when pressed
favPage.addEventListener('click', () => {
    content.innerHTML = "";
    topAmmoContainer.style.display = 'none';
    fetch(`${URL}fav/page`)
    .then((response) => response.json())
    .then((data) => {
        showFavorites(data)
    })
});

//Delete Button
//Adds funcitonallity to the dynamically created delete from favorites button.
//When pressed it removes the coresponding information from the favorites table.
function deleteButton(button){
    button.addEventListener('click', event => {
        content.innerHTML = "";
        let deleteBarValue = event.target.parentElement
        console.log(deleteBarValue.children[0].textContent[1])
        fetch(`${URL}delete/${deleteBarValue.children[0].textContent}`,
        {method: 'DELETE'})
        .then(alert('Delete Succesful'))
        .then(
            fetch(`${URL}fav/page`)
            .then((response) => response.json())
            .then((data) => {
                showFavorites(data)
            })
            .catch((error) => console.log(error))
        ) 
        .catch((error) => console.log(error))
    })    
};

//Show Top Ammo
//shows the top three ammo's when the top ammo button is pressed
topAmmo.addEventListener('click', () => {
    content.innerHTML = "";
    if (topAmmoContainer.style.display === 'none'){
        topAmmoContainer.style.display = 'block'
    }
    fetch(`${URL}topthree`)
    .then((response) => response.json())
    .then((data) => showTopThree(data))
});

//Update Top Ammo
//Adds the ability to update one of the top three ammos when the inputs are filled in, a spot is selected and the update button is pressed
//Sends a request to the database to update that information in the top ammo table
topAmmoUpdate.addEventListener('click', () => {
    //Adds variables to acces the information used for the json body
    let ammoVal = ammoDropdown.value;
    let ammoName = topAmmoName.value;
    let ammoCal = topAmmoCaliber.value;
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
                caliber: `${ammoCal}`,
                effective: `${ammoEff}`
            })
        })
        .then((response) => response)
        .then(
            alert('Update Success')
        )
        .then(
            //Used ot repopulate the page with the new information, and clears out the search bars after the update is finished
            fetch(`${URL}topthree`)
            .then((response) => response.json())
            .then(                
                topAmmoName.value = "",
                topAmmoEffective.value = "",
                topAmmoCaliber.value = "",
                content.innerHTML = ""
            )
            .then((data) => {
                showTopThree(data)
            })
            .catch((error) => console.log(error))
        )
        .catch((error) => console.log(error))
    }
});

//Show gun information
//Creates the divs information is placed into if user searches by gun, called when search button is pressed
function showGunData(data){
    for(let i = 0; i < data.length; i++){
        divCreation(data[i].gun_name, data[i].name)
    }
};

//Show ammo information
//Creates the divs and adds information to the page if user searches by ammo, called when search button is pressed
function showAmmoData(data) {
    for(let i = 0; i < data.length; i++){
        ammoDivCreation(data[i].ammo_name, data[i].name, data[i].effective)
    }
};

//Favorites
//Shows the users added favorites, called when show favorites button is pressed
function showFavorites(data) {
    for(let i = 0; i < data.length; i++){
        favDivCreation(data[i].gun_name, data[i].cal_name)
    }
};

//Top Ammo
//Creates the divs and adds ifnormation to the top three ammo page when Top Ammo is pressed
function showTopThree(data) {
    for(let i = 0; i < data.length; i++){
        ammoDivCreation(data[i].name, data[i].caliber, data[i].effective)
    }
};

//Gun Requests
//creates the information that the user sees for gun requests
function divCreation(dataName, dataCaliber) {
    //Adds a container for the paragraph tags
    divInfoContainer = document.createElement('div');
    divInfoContainer.classList.add('contentDiv');
    
    //Adds a paragraph tag for gun information
    divInfo = document.createElement('p');
    divInfo.textContent = `Gun: ${dataName}`;
    divInfo.setAttribute('id','divInfo');
    
    //Adds a paragraph element for the caliber information to be shown
    caliberInfo = document.createElement('p');
    caliberInfo.textContent = `Caliber: ${dataCaliber}`;
    caliberInfo.setAttribute('id','calInfo');
    
    //Places all the information into the container div
    divInfoContainer.appendChild(divInfo);
    divInfoContainer.appendChild(caliberInfo);
    content.appendChild(divInfoContainer)
    
    //Adds a favorite button to all divs so information can be added to favorites.
    let favButton = document.createElement('button')
    favButton.innerHTML = "Add to Favorites";
    favButton.classList.add('button');
    divInfoContainer.appendChild(favButton);
    addListener(favButton);
};

//Ammo Requests
//creates the information that the user sees for ammo requests
function ammoDivCreation(dataName, dataCaliber, dataEffective) {
    divInfoContainer = document.createElement('div')
    divInfoContainer.classList.add('contentDiv')
    
    //creates name text
    divInfo = document.createElement('p');
    divInfo.textContent = `Ammo Name: ${dataName}`;
    divInfo.setAttribute('id','divInfo');
    
    //creates caliber text
    caliberInfo = document.createElement('p');
    caliberInfo.textContent = `Caliber: ${dataCaliber}`;
    caliberInfo.setAttribute('id','calInfo');
    
    //creates effective text
    ammoInfo = document.createElement('p');
    ammoInfo.textContent = `Effective Against: ${dataEffective}`;
    ammoInfo.setAttribute('id','effective');
    
    //Appends all information into container then content
    divInfoContainer.appendChild(divInfo);
    divInfoContainer.appendChild(caliberInfo)
    divInfoContainer.appendChild(ammoInfo);
    content.appendChild(divInfoContainer)
    
    //Adds a favorite button to each div
    // let favButton = document.createElement('button')
    // favButton.innerHTML = "Add to Favorites";
    // favButton.classList.add('button');
    // divInfoContainer.appendChild(favButton);
    // addListener(favButton);
};

//Favorites page
//creates the information the user sees for their favorites
function favDivCreation(dataName, dataCaliber){
    //Creates div for paragraphs to be placed into
    divInfoContainer = document.createElement('div');
    divInfoContainer.classList.add('contentDiv');

    //Adds name information
    divInfo = document.createElement('p');
    divInfo.textContent = `Name: ${dataName}`;
    divInfo.setAttribute('id','divInfo');

    //Adds caliber information
    caliberInfo = document.createElement('p');
    caliberInfo.textContent = `Caliber: ${dataCaliber}`;
    caliberInfo.setAttribute('id','calInfo');

    //Adds all information to the page
    divInfoContainer.appendChild(divInfo);
    divInfoContainer.appendChild(caliberInfo);
    content.appendChild(divInfoContainer);

    //Creates a delete button so user can remove from favorites
    let delButton = document.createElement('button')
    delButton.innerHTML = "Delete from Favorites";
    delButton.classList.add('button');
    divInfoContainer.appendChild(delButton);
    deleteButton(delButton);
};
