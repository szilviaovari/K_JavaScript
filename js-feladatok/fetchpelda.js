function fetching(id){
    fetch(`https://surveys-5jvt.onrender.com/api/cars/?id=${id}`)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(user => {
    console.log(user);
    megjelenites(user);
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });
}

function megjelenites(adatok){
    document.getElementById("id").textContent = adatok.id;
    document.getElementById("model").textContent = adatok.model;
    document.getElementById("brand").textContent = adatok.brand;
    document.getElementById("year").textContent = adatok.year;
}

function kereses(){
    id = document.getElementById("userID").value
    fetching(id);
}