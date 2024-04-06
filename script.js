// Sélection des éléments HTML
const input = document.querySelector("input");
const addButton = document.querySelector(".add-button");
const todosHtml = document.querySelector(".todos");
const emptyImage = document.querySelector(".empty-image");
const deleteAllButton = document.querySelector(".delete-all");
const filters = document.querySelectorAll(".filter");

// Récupération des tâches depuis le stockage local ou initialisation à un tableau vide
let todosJson = JSON.parse(localStorage.getItem("todos")) || [];

// Variable pour filtrer les tâches
let filter = "";

// Fonction pour générer le HTML d'une tâche
function getTodoHtml(todo, index) {
  // Si un filtre est appliqué et que la tâche ne correspond pas au filtre, retourne une chaîne vide
  if (filter && filter != todo.status) {
    return "";
  }
  // Détermine si la tâche est cochée (complétée)
  let checked = todo.status == "completed" ? "checked" : "";
  // Retourne le HTML de la tâche
  return /* html */ `
    <li class="todo">
      <label for="${index}">
        <input id="${index}" onclick="updateStatus(this)" type="checkbox" ${checked}>
        <span class="${checked}">${todo.name}</span>
      </label>
      <button class="delete-btn" data-index="${index}" onclick="remove(this)"><i class="fa fa-times"></i></button>
    </li>
  `;
}

// Fonction pour afficher les tâches
function showTodos() {
  if (todosJson.length == 0) {
    // Si aucune tâche n'existe, affiche l'image vide
    todosHtml.innerHTML = "";
    emptyImage.style.display = "block";
  } else {
    // Sinon, affiche les tâches
    todosHtml.innerHTML = todosJson.map(getTodoHtml).join("");
    emptyImage.style.display = "none";
  }
}

// Fonction pour ajouter une nouvelle tâche
function addTodo(todo) {
  input.value = "";
  // Ajoute la nouvelle tâche au début du tableau des tâches
  todosJson.unshift({ name: todo, status: "pending" });
  // Enregistre les tâches dans le stockage local
  localStorage.setItem("todos", JSON.stringify(todosJson));
  // Actualise l'affichage des tâches
  showTodos();
}

// Écouteurs d'événements pour ajouter une tâche (clavier et clic)
input.addEventListener("keyup", (e) => {
  let todo = input.value.trim();
  if (!todo || e.key != "Enter") {
    return;
  }
  addTodo(todo);
});

addButton.addEventListener("click", () => {
  let todo = input.value.trim();
  if (!todo) {
    return;
  }
  addTodo(todo);
});

// Fonction pour mettre à jour le statut d'une tâche (complétée ou non)
function updateStatus(todo) {
  let todoName = todo.parentElement.lastElementChild;
  if (todo.checked) {
    todoName.classList.add("checked");
    todosJson[todo.id].status = "completed";
  } else {
    todoName.classList.remove("checked");
    todosJson[todo.id].status = "pending";
  }
  // Enregistre les tâches dans le stockage local après la mise à jour
  localStorage.setItem("todos", JSON.stringify(todosJson));
}

// Fonction pour supprimer une tâche
function remove(todo) {
  const index = todo.dataset.index;
  // Supprime la tâche correspondante du tableau des tâches
  todosJson.splice(index, 1);
  // Actualise l'affichage des tâches
  showTodos();
  // Enregistre les tâches dans le stockage local après la suppression
  localStorage.setItem("todos", JSON.stringify(todosJson));
}

// Écouteurs d'événements pour les filtres
filters.forEach(function (el) {
  el.addEventListener("click", (e) => {
    if (el.classList.contains("active")) {
      el.classList.remove("active");
      filter = "";
    } else {
      // Désactive tous les filtres et active le filtre sélectionné
      filters.forEach((tag) => tag.classList.remove("active"));
      el.classList.add("active");
      filter = e.target.dataset.filter;
    }
    // Actualise l'affichage des tâches avec le filtre sélectionné
    showTodos();
  });
});

// Écouteur d'événement pour le bouton de suppression de toutes les tâches
deleteAllButton.addEventListener("click", () => {
  // Vide le tableau des tâches
  todosJson = [];
  // Actualise l'affichage des tâches
  showTodos();
  // Enregistre les tâches vides dans le stockage local
  localStorage.setItem("todos", JSON.stringify(todosJson));
});
