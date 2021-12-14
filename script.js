
let contacts = [];
const formRef = document.querySelector(".register-form-js");
const listRef = document.querySelector(".contacts-list-output-js");
const loaderRef = document.querySelector(".loader-js");

formRef.addEventListener("submit", formSubmitHandler);
listRef.addEventListener("click", ({ target }) => updateUser(target));


function getRandomTime(min, max) {
  return Math.floor(Math.random() * max + min);
}

setTimeout(() => {
  fetch("./db.json")
    .then((data) => data.json())
    .then((data) => {
      contacts = [...contacts, ...data].reverse();
      addUserToList(contacts);
    })
    .catch(console.log)
    .finally(() => {
      loaderRef.style.display = "none";
    });
}, getRandomTime(2000, 4000));

function getRandomId() {
  return Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "");
}
function formSubmitHandler(event) {
  event.preventDefault();
  const forRef = event.target;
  const submittedData = {
    id: getRandomId(),
    name: forRef.elements[0].value,
    phone: forRef.elements[1].value,
  };
  contacts.unshift(submittedData);
  addUserToList(contacts);
  // createContact(submittedData)
  forRef.reset();

}

function switchInputEnable(target, pointer) {
  const cellsListRef = target.parentNode.parentNode;
  const inputRef = cellsListRef.querySelectorAll(".data-input");
  const labelRef = cellsListRef.querySelectorAll(".label-input");
  inputRef.forEach((input) => (input.style.pointerEvents = pointer));
  labelRef.forEach((input) => (input.style.pointerEvents = pointer));
}
let isEditBtn = true;
function addUserToList(users) {
  listRef.innerHTML = "";
  const murkup = users
    .map(
      (user) => `
  <li class="contact-item" id=${user.id}>
    <ul class="cells-list">
      <li class="cell-item">
       <label for="name-output" class="label-input">Name:&nbsp;</label>
       <input type="text" name="name" class="data-input name-input-js" id="name-output" value="${user.name}">
      </li>
      <li class="cell-item">
        <label for="number-output" class="label-input">Phone:&nbsp;</label>
        <input type="tel" name="phone" class="data-input phone-input-js" id="number-output" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" value="${user.phone}">
      </li>
      <li class="cell-item">
        <button id="edit-btn" type="button" class="edit-btn edit-js">Edit</button>
        <button type="button" class="delete-btn delete">Delete</button>
      </li>
    </ul>
  </li>
`
    )
    .join("");
  listRef.insertAdjacentHTML("afterbegin", murkup);
 

}
// async function createContact (name, phone) {
//   const options = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ name, phone }),
//   };
//   const response = await fetch("./db.json", options);
//   return await response.json();
// };

function updateUser(target) {
  if (target.nodeName !== "BUTTON" && target.nodeName !== "INPUT") return;
  const userNode = target.parentNode.parentNode.parentNode;
  if (target.nodeName === "BUTTON") {
    if (target.classList.contains("edit-js") && isEditBtn) {
      switchInputEnable(target, "all");
      isEditBtn = false;
      target.textContent = "Save";
      return;
    }
    if (target.classList.contains("edit-js") && !isEditBtn) {
      switchInputEnable(target, "none");
      isEditBtn = true;
      target.textContent = "Edit";
    }
    if (target.classList.contains("delete")) {
      contacts = contacts.filter((user) => user.id !== userNode.id);
      // deleteContact(id);
      addUserToList(contacts);


    }
  }
  if (target.nodeName === "INPUT") {
    target.addEventListener("change", editData);
    function editData(event) {
      const contactById = contacts.find(
        (contact) => contact.id === userNode.id
      );
      contactById[target.name] = event.target.value;
      target.removeEventListener("change", editData);
    }
  }
}
// async function deleteContact  (id)  {
//   const options = {
//     method: "DELETE",
//   }
//   const response = await fetch(`${url}${id}`,
//     options
//   );
//   return await response.json();
   
// }
