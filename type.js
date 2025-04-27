document.addEventListener("DOMContentLoaded", function () {
    var createGroupBtn = document.getElementById("createGroup");
    var groupList = document.getElementById("groupList");
    var personSelect = document.getElementById("personSelect");
    var expenseForm = document.getElementById("expenseForm");
    var expenseList = document.getElementById("expenseList");
    var summaryList = document.getElementById("summaryList");
  
    var groups = JSON.parse(localStorage.getItem("groups") || "[]");
    var expenses = JSON.parse(localStorage.getItem("expenses") || "[]");
    var currentGroupIndex = JSON.parse(localStorage.getItem("currentGroupIndex") || "null");
    var currentGroup = currentGroupIndex !== null ? groups[currentGroupIndex] : null;
  
    var modal = document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML = `
      <div class="modal-content">
        <h3>Neue Gruppe erstellen</h3>
        <input id="modalGroupName" type="text" placeholder="Gruppenname">
        <textarea id="modalMembers" placeholder="Mitglieder (durch Komma getrennt)"></textarea>
        <div class="modal-buttons">
          <button id="modalCreate">Erstellen</button>
          <button id="modalCancel">Abbrechen</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  
    function saveAll() {
      localStorage.setItem("groups", JSON.stringify(groups));
      localStorage.setItem("expenses", JSON.stringify(expenses));
      var idx = currentGroup ? groups.indexOf(currentGroup) : null;
      localStorage.setItem("currentGroupIndex", JSON.stringify(idx));
    }
  
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
      saveAll();
      renderGroups();
      updatePersonDropdown();
      expenses = [];
      renderExpenses();
      renderSummary();
      hideModal();
    });
  
    function renderGroups() {
      groupList.innerHTML = "";
      groups.forEach(function (group, index) {
        var li = document.createElement("li");
        li.textContent = group.name + " (" + group.members.join(", ") + ")";
        li.style.cursor = "pointer";
        li.onclick = function () {
          currentGroup = group;
          saveAll();
          updatePersonDropdown();
          expenses = JSON.parse(localStorage.getItem("expenses") || "[]");
          renderExpenses();
          renderSummary();
        };
        groupList.appendChild(li);
      });
    }
  
    function updatePersonDropdown() {
      personSelect.innerHTML = "";
      if (!currentGroup) return;
      currentGroup.members.sort().forEach(function (member) {
        personSelect.appendChild(new Option(member, member));
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
        groupName: currentGroup.name,
        description: descInput.value,
        amount: parseFloat(amountInput.value),
        paidBy: paidBy
      };
      expenses.push(expense);
      saveAll();
      renderExpenses();
      renderSummary();
      expenseForm.reset();
      updatePersonDropdown();
    });
  
    function renderExpenses() {
      expenseList.innerHTML = "";
      expenses
        .filter(function (e) { return e.groupName === (currentGroup && currentGroup.name); })
        .forEach(function (e) {
          var li = document.createElement("li");
          li.textContent = e.description + ": €" + e.amount.toFixed(2) + " (von " + e.paidBy + ")";
          expenseList.appendChild(li);
        });
    }
  
    function renderSummary() {
      if (!currentGroup) return;
      var balances = {};
      var members = currentGroup.members;
      expenses
        .filter(function (e) { return e.groupName === currentGroup.name; })
        .forEach(function (exp) {
          var split = exp.amount / members.length;
          members.forEach(function (name) {
            if (!balances[name]) balances[name] = 0;
            if (name === exp.paidBy) {
              balances[name] += exp.amount - split;
            } else {
              balances[name] -= split;
            }
          });
        });
      summaryList.innerHTML = "";
      Object.entries(balances).forEach(function (_a) {
        var name = _a[0], balance = _a[1];
        var li = document.createElement("li");
        li.textContent = name + " " + (balance >= 0 ? "bekommt" : "schuldet") + " €" + Math.abs(balance).toFixed(2);
        summaryList.appendChild(li);
      });
    }
  
    renderGroups();
    updatePersonDropdown();
    renderExpenses();
    renderSummary();
  });
  