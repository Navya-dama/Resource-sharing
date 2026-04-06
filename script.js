let items = JSON.parse(localStorage.getItem("items")) || [];

async function addItem() {
  const name = document.getElementById("name").value;
  const category = document.getElementById("category").value;
  const contact = document.getElementById("contact").value;

  if (!name || !category || !contact) {
    alert("Fill all fields");
    return;
  }

  await fetch("http://127.0.0.1:5000/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, category, contact })
  });

  displayItems();
}

async function displayItems() {
  const res = await fetch("http://127.0.0.1:5000/items");
  const items = await res.json();

  const container = document.getElementById("items");
  container.innerHTML = "";

  items.forEach(item => {
    container.innerHTML += `
      <div class="card">
        <h3>${item.name}</h3>
        <p>${item.category}</p>

        <button onclick="showModal('${item.contact}')">Request</button>
        <button onclick="deleteItem(${item.id})">Delete</button>
      </div>
    `;
  });
}
async function deleteItem(id) {
  await fetch(`http://127.0.0.1:5000/delete/${id}`, {
    method: "DELETE"
  });

  displayItems();
}

function searchItem() {
  const search = document.getElementById("search").value.toLowerCase();

  const filtered = items.filter(item =>
    item.name.toLowerCase().includes(search) ||
    item.category.toLowerCase().includes(search)
  );

  displayItems(filtered);
}

// function toggleDarkMode() {
//   document.body.classList.toggle("dark");
// }

// function filterCategory() {
//   const value = document.getElementById("filter").value;

//   if (!value) {
//     displayItems();
//     return;
//   }

//   const filtered = items.filter(item =>
//     item.category.toLowerCase().includes(value)
//   );

//   displayItems(filtered);
// }
function showModal(text) {
  document.getElementById("modalText").innerText = text;
  document.getElementById("modal").style.display = "block";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}
function editItem(index) {
  const item = items[index];

  document.getElementById("name").value = item.name;
  document.getElementById("category").value = item.category;
  document.getElementById("contact").value = item.contact;

  deleteItem(index);
}
displayItems();