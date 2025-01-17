const carForm = document.getElementById("carForm");
const carList = document.getElementById("carList");
const carIdInput = document.getElementById("carId");

// Knappar
const addButton = document.getElementById("addButton");
const saveButton = document.getElementById("saveButton");
const deleteButton = document.getElementById("deleteButton");
const updateButton = document.getElementById("updateButton");

// Hämta bilar från SQLite
function fetchCars() {
  fetch("http://localhost:8000/cars")
    .then((res) => res.json())
    .then((cars) => {
      carList.innerHTML = "";
      cars.forEach((car) => {
        const div = document.createElement("div");
        div.classList = "p-4 bg-[#d46e77] text-white rounded-lg border-5 border-[${user.color}] shadow-md hover:shadow-lg cursor-pointer transform transition-transform duration-300 hover:scale-105";
        div.innerHTML = `
          <div class="font-bold">${car.brand}</div>
          <div class="font-medium" id="carColorText-${car.id}">Färg: ${car.color}</div>
          <div class="text-sm">Årsmodell: ${car.year}</div>
          <div class="text-sm absolute top-4 right-4">ID: ${car.id}</div>
        `; 

        div.style.backgroundColor = car.color;

        // Klickhändelse för att välja bil
        div.addEventListener("click", () => {
          carIdInput.value = car.id;
          document.getElementById("brand").value = car.brand;
          document.getElementById("color").value = car.color;
          document.getElementById("year").value = car.year;

          // Uppdatera textfärgen i input-fältet till bilens färg
          document.getElementById("color").style.color = car.color; // Färgen på bilens färg
        });

        carList.appendChild(div);
      });
    });
}

// Lägg till bil
addButton.addEventListener("click", () => {
  const carData = getCarData();
  fetch("http://localhost:8000/cars", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(carData),
  }).then(() => {
    resetForm();
    fetchCars();
  });
});

// Ta bort bil
deleteButton.addEventListener("click", () => {
  const id = carIdInput.value;
  if (!id) {
    alert("Välj en bil att ta bort.");
    return;
  }

  fetch(`http://localhost:8000/cars/${id}`, {
    method: "DELETE",
  }).then(() => {
    resetForm();
    fetchCars();
  });
});

// Uppdatera bil
updateButton.addEventListener("click", () => {
  const id = carIdInput.value;
  const carData = getCarData();
  if (!id) {
    alert("Välj en bil att uppdatera.");
    return;
  }

  fetch(`http://localhost:8000/cars/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(carData),
  }).then(() => {
    resetForm();
    fetchCars();
  });
});




// Hämta data från formuläret
function getCarData() {
  return {
    brand: document.getElementById("brand").value,
    color: document.getElementById("color").value,
    year: document.getElementById("year").value,
  };
}

// Återställ formuläret
function resetForm() {
  carForm.reset();
  carIdInput.value = "";
}

fetchCars();
