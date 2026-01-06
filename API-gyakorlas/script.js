function fetching(id){
    fetch("https://surveys-5jvt.onrender.com/api/cars/")
        .then(response => response.json())
        .then(tomb => {
            const talalat = tomb.find(elem => elem.id == id);
            if (!talalat) {
                alert("Nincs ilyen sorszámú felhasználó!");
                return;
            }
            console.log(talalat);
            megjelenites(talalat);
        })
        .catch(error => console.error(error));
}

function megjelenites(adatok){
    document.getElementById("id").textContent = "ID: " + adatok.id;
    document.getElementById("model").textContent = "Model: " + adatok.model;
    document.getElementById("brand").textContent = "Márka: " + adatok.brand;
    document.getElementById("year").textContent = "Évjárat: " + adatok.year;
}

function kereses(){
    id = document.getElementById("userID").value
    if (id === "") {
        alert("Adj meg egy sorszámot!");
        return;
    }
    fetching(id);

}