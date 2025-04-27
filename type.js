document.addEventListener("DOMContentLoaded", function () {
    var createGroupBtn = document.getElementById("createGroup");
    var groupList = document.getElementById("groupList");
    var personSelect = document.getElementById("personSelect");
    var expenseForm = document.getElementById("expenseForm");
    var expenseList = document.getElementById("expenseList");
    var summaryList = document.getElementById("summaryList");
  
    var groups = [];
    var currentGroup = null;
    var expenses = [];

    var modal = document.createElement("div");
  modal.classList.add("modal");
  modal.innerHTML = `<div class="modal-content">
      <h3>Neue Gruppe erstellen</h3>
      <input id="modalGroupName" type="text" placeholder="Gruppenname">
      <textarea id="modalMembers" placeholder="Mitglieder (durch Komma getrennt)"></textarea>
      <div class="modal-buttons">
        <button id="modalCreate">Erstellen</button>
        <button id="modalCancel">Abbrechen</button>
      </div>
    </div>`;
  document.body.appendChild(modal);

  function showModal() {
    modal.style.display = "flex";
  }
  function hideModal() {
    modal.style.display = "none";
    document.getElementById("modalGroupName").value = "";
    document.getElementById("modalMembers").value = "";
  }

  document.getElementById("modalCancel").addEventListener("click", hideModal);
  createGroupBtn.addEventListener("click", showModal);

  document.getElementById("modalCreate").addEventListener("click", function () {
    var groupName = document.getElementById("modalGroupName").value.trim();
    var membersInput = document.getElementById("modalMembers").value.trim();
    if (!groupName || !membersInput) {
      alert("Bitte gib einen Namen und Mitglieder an.");
      return;
    }
    var members = membersInput.split(",").map(function (n) { return n.trim(); }).filter(Boolean);
    if (members.length < 1) {
      alert("Mindestens ein Mitglied muss angegeben werden.");
      return;
    }
    var group = { name: groupName, members: members };
    groups.push(group);
    currentGroup = group;
    renderGroups();
    hideModal();
  });
  function renderGroups() {
    groupList.innerHTML = "";
    groups.forEach(function (group) {
      var li = document.createElement("li");
      li.textContent = group.name + " (" + group.members.join(", ") + ")";
      li.style.cursor = "pointer";
      li.onclick = function () {
        currentGroup = group;
        updatePersonDropdown();
      };
      groupList.appendChild(li);
    });
  }

  function updatePersonDropdown() {
    if (!currentGroup) return;
    personSelect.innerHTML = "";
    currentGroup.members.sort().forEach(function (member) {
      var opt = new Option(member, member);
      personSelect.appendChild(opt);
    });
  }
  expenseForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!currentGroup) {
      alert("Bitte erst eine Gruppe erstellen");
      return;
    }
    var inputs = expenseForm.querySelectorAll("input");
    var descInput = inputs[0], amountInput = inputs[1];
    var paidBy = personSelect.value;

    var expense = {
      description: descInput.value,
      amount: parseFloat(amountInput.value),
      paidBy: paidBy
    };
    expenses.push(expense);
    renderExpenses();   
    expenseForm.reset();
    updatePersonDropdown();
  });

  function renderExpenses() {
    expenseList.innerHTML = "";
    expenses.forEach(function (e) {
      var li = document.createElement("li");
      li.textContent = e.description + ": €" + e.amount.toFixed(2) + " (von " + e.paidBy + ")";
      expenseList.appendChild(li);
    });
  }
});
