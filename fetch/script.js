function fetching(id){
    fetch("https://jsonplaceholder.typicode.com/users")
        .then(response => response.json())
        .then(tomb => {
            const talalat = tomb.find(elem => elem.id == id);
            if (!talalat) {
                alert("Nincs ilyen sorszámú felhasználó!");
                return;
            }
            megjelenites(talalat);
        })
        .catch(error => console.error(error));
}

function megjelenites(adatok){
    document.getElementById("id").textContent = adatok.id;
    document.getElementById("nev").textContent = [adatok.firstname, adatok.lastname].join(" ");
    document.getElementById("telefon").textContent = adatok.phone;
    document.getElementById("email").textContent = adatok.email;
    document.getElementById("cim").textContent = adatok.address.zipcode + " " + adatok.address.city + " " + adatok.address.street + " " + adatok.address.suite;
    document.getElementById("geo").textContent = adatok.address.geo.lat + "; " + adatok.address.geo.lng;
    document.getElementById("cegadat").textContent = adatok.company.name + " " + adatok.company.catchPhrase + " " + adatok.company.bs
}

function kereses(){
    id = document.getElementById("userID").value
    fetching(id);
}