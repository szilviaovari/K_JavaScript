function fetching(id){
    fetch("https://surveys-5jvt.onrender.com/api/wizards")
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
    document.getElementById("id").textContent = "ID: " + adatok.id;
    document.getElementById("name").textContent = "Név: " + adatok.name;
    document.getElementById("house").textContent = "Ház: " + adatok.house;
    document.getElementById("boggart").textContent = "Mumusa: " + adatok.boggart;
}

function kereses(){
    id = document.getElementById("userID").value
    if (id === "") {
        alert("Adj meg egy sorszámot!");
        return;
    }
    fetching(id);
}