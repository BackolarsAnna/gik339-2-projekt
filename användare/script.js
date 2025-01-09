const userForm = document.getElementById("userForm");
const userList = document.getElementById("userList");
const userIdInput = document.getElementById("userId");

// Knappar
const addButton = document.getElementById("addButton");
const saveButton = document.getElementById("saveButton");
const deleteButton = document.getElementById("deleteButton");
const updateButton = document.getElementById("updateButton");

// TODO - Fixa för att hämta användare
// TODO - Fixa SQlite paket 

function fetchUsers() {
  fetch("http://localhost:8000/users")
    .then((res) => res.json())
    .then((users) => {
      userList.innerHTML = "";
      users.forEach((user) => {
        const div = document.createElement("div");
        div.classList = "p-4 bg-[#d46e77] text-white rounded-lg border-5 border-[#5c0d2b] shadow-md hover:shadow-lg shadow-md cursor-pointer transform transition-transform duration-300 hover:scale-105";
        div.innerHTML = `
          <div class="font-bold" style="color: ${user.color}">${user.firstName} ${user.lastName}</div>
          <div class="font-medium" style="color: ${user.color}">${user.username}</div>
           <div class="text-sm" style="color: ${user.color}">${user.color}</div>
           <div class="text-sm absolute top-4 right-4">ID: ${user.id}</div>
        `;

        // Klickhändelse för att välja användare
        div.addEventListener("click", () => {
          userIdInput.value = user.id;
          document.getElementById("firstName").value = user.firstName;
          document.getElementById("lastName").value = user.lastName;
          document.getElementById("username").value = user.username;
          document.getElementById("color").value = user.color;
        });

        userList.appendChild(div);
      });
    });
}


// Lägg till användare
addButton.addEventListener("click", () => {
  const userData = getUserData();
  fetch("http://localhost:8000/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  }).then(() => {
    resetForm();
    fetchUsers();
  });
});

// Ta bort användare
deleteButton.addEventListener("click", () => {
  const id = userIdInput.value;
  if (!id) {
    alert("Välj en användare att ta bort.");
    return;
  }

  fetch(`http://localhost:8000/users/${id}`, {
    method: "DELETE",
  }).then(() => {
    resetForm();
    fetchUsers();
  });
});

// Uppdatera användare
updateButton.addEventListener("click", () => {
  const id = userIdInput.value;
  const userData = getUserData();
  if (!id) {
    alert("Välj en användare att uppdatera.");
    return;
  }

  fetch(`http://localhost:8000/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  }).then(() => {
    resetForm();
    fetchUsers();
  });
});


// Spara användare
saveButton.addEventListener("click", (e) => {
  e.preventDefault();
  addButton.click();
});


// Hämta data från formuläret
function getUserData() {
  return {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    username: document.getElementById("username").value,
    color: document.getElementById("color").value,
  };
}

// Återställ formuläret
function resetForm() {
  userForm.reset();
  userIdInput.value = "";
}

fetchUsers();
