const API_URL = "https://surveys-5jvt.onrender.com/api/cars";

function fetchCars() {
  fetch(API_URL)
    .then(res => res.json())
    .then(cars => {
      const container = document.getElementById("carList");
      container.innerHTML = "";
      cars.forEach((car, index) => {
        const card = document.createElement("div");
        card.className = "car-card";
        card.innerHTML = `
          <p><strong>Modell:</strong> ${car.model}</p>
          <button onclick="viewCar(${car.id})">Részletek</button>
          ${index >= 4 ? `<button onclick="deleteCar(${car.id})">Törlés</button>` : ""}
        `;
        container.appendChild(card);
      });
    })
    .catch(err => alert("Hiba az autók lekérésekor: " + err));
}

function viewCar(id) {
  fetch(`${API_URL}/${id}`)
    .then(res => res.json())
    .then(car => {
      document.getElementById("carDetails").innerHTML = `
        <p>ID: ${car.id}</p>
        <p>Modell: ${car.model}</p>
        <p>Brand: ${car.brand}</p>
        <p>Év: ${car.year}</p>
        ${car.id > 4 ? `<button onclick="editCar(${car.id})">Szerkesztés</button>` : ""}
      `;
    })
    .catch(err => alert("Hiba az autó lekérésekor: " + err));
}

function addCar() {
  const model = document.getElementById("newModel").value;
  const brand = document.getElementById("newBrand").value;
  const year = parseInt(document.getElementById("newYear").value);

  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=UTF-8" },
    body: JSON.stringify({ model, brand, year })
  })
    .then(res => res.json())
    .then(() => fetchCars())
    .catch(err => alert("Hiba új autó hozzáadásakor: " + err));
}

function editCar(id) {
  const model = prompt("Új modell neve:");
  const brand = prompt("Új márka:");
  const year = prompt("Új év:");

  fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json; charset=UTF-8" },
    body: JSON.stringify({ model, brand, year: parseInt(year) })
  })
    .then(res => res.json())
    .then(() => fetchCars())
    .catch(err => alert("Hiba az autó módosításakor: " + err));
}

function deleteCar(id) {
  fetch(`${API_URL}/${id}`, { method: "DELETE" })
    .then(res => {
      if (!res.ok) throw new Error("Törlés sikertelen");
      fetchCars();
    })
    .catch(err => alert(err));
}

document.addEventListener("DOMContentLoaded", fetchCars);
