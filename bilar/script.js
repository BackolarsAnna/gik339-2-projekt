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

// Spara bil
saveButton.addEventListener("click", async () => {
  const carData = getCarData(); // Hämta data från formuläret

  // Kontrollera att alla fält är ifyllda
  if (!carData.brand || !carData.color || !carData.year) {
    alert("Vänligen fyll i alla fält innan du sparar.");
    return;
  }

  // Skicka datan till servern via POST /cars
  fetch("http://localhost:8000/cars", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(carData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Ett fel uppstod vid sparandet.");
      }
      return response.json();
    })
    .then(() => {
      resetForm(); // Återställ formuläret
      fetchCars(); // Hämta uppdaterad lista med bilar
      alert("Bilen har sparats!"); // Visa ett enkelt meddelande
    })
    .catch((error) => {
      console.error("Fel vid sparandet:", error);
      alert("Ett fel uppstod: " + error.message);
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
