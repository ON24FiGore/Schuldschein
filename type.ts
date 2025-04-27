interface Group {
    name: string;
    members: string[];
  }
  interface Expense {
    groupName: string;
    description: string;
    amount: number;
    paidBy: string;
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    const createGroupBtn = document.getElementById("createGroup") as HTMLButtonElement;
    const groupList = document.getElementById("groupList") as HTMLUListElement;
    const personSelect = document.getElementById("personSelect") as HTMLSelectElement;
    const expenseForm = document.getElementById("expenseForm") as HTMLFormElement;
    const expenseList = document.getElementById("expenseList") as HTMLUListElement;
    const summaryList = document.getElementById("summaryList") as HTMLUListElement;
  
    let groups: Group[] = JSON.parse(localStorage.getItem("groups") || "[]");
    let expenses: Expense[] = JSON.parse(localStorage.getItem("expenses") || "[]");
    let currentGroupIndex: number | null = JSON.parse(localStorage.getItem("currentGroupIndex") || "null");
    let currentGroup: Group | null = currentGroupIndex !== null ? groups[currentGroupIndex] : null;
  
    const modal = document.createElement("div");
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
  
    function saveAll(): void {
      localStorage.setItem("groups", JSON.stringify(groups));
      localStorage.setItem("expenses", JSON.stringify(expenses));
      const idx = currentGroup ? groups.indexOf(currentGroup) : null;
      localStorage.setItem("currentGroupIndex", JSON.stringify(idx));
    }
  
    function showModal(): void {
      modal.style.display = "flex";
    }
  
    function hideModal(): void {
      modal.style.display = "none";
      (document.getElementById("modalGroupName") as HTMLInputElement).value = "";
      (document.getElementById("modalMembers") as HTMLTextAreaElement).value = "";
    }
  
    (document.getElementById("modalCancel") as HTMLButtonElement).addEventListener("click", hideModal);
    createGroupBtn.addEventListener("click", showModal);
  
    (document.getElementById("modalCreate") as HTMLButtonElement).addEventListener("click", () => {
      const groupName = (document.getElementById("modalGroupName") as HTMLInputElement).value.trim();
      const membersInput = (document.getElementById("modalMembers") as HTMLTextAreaElement).value.trim();
      if (!groupName || !membersInput) {
        alert("Bitte gib einen Namen und Mitglieder an.");
        return;
      }
      const members = membersInput.split(",").map(n => n.trim()).filter(Boolean);
      if (members.length < 1) {
        alert("Mindestens ein Mitglied muss angegeben werden.");
        return;
      }
      const group: Group = { name: groupName, members };
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
  
    function renderGroups(): void {
      groupList.innerHTML = "";
      groups.forEach((group, index) => {
        const li = document.createElement("li");
        li.textContent = `${group.name} (${group.members.join(", ")})`;
        li.style.cursor = "pointer";
        li.onclick = () => {
          currentGroup = group;
          saveAll();
          updatePersonDropdown();
          renderExpenses();
          renderSummary();
        };
        groupList.appendChild(li);
      });
    }
  
    function updatePersonDropdown(): void {
      personSelect.innerHTML = "";
      if (!currentGroup) return;
      currentGroup.members.sort().forEach(member => {
        personSelect.appendChild(new Option(member, member));
      });
    }
  
    expenseForm.addEventListener("submit", e => {
      e.preventDefault();
      if (!currentGroup) {
        alert("Bitte erst eine Gruppe erstellen");
        return;
      }
      const inputs = expenseForm.querySelectorAll("input") as NodeListOf<HTMLInputElement>;
      const [descInput, amountInput] = inputs;
      const paidBy = personSelect.value;
  
      const expense: Expense = {
        groupName: currentGroup.name,
        description: descInput.value,
        amount: parseFloat(amountInput.value),
        paidBy
      };
      expenses.push(expense);
      saveAll();
      renderExpenses();
      renderSummary();
      expenseForm.reset();
      updatePersonDropdown();
    });
  
    function renderExpenses(): void {
      expenseList.innerHTML = "";
      if (!currentGroup) return;
      expenses
        .filter(e => e.groupName === currentGroup!.name)
        .forEach(e => {
          const li = document.createElement("li");
          li.textContent = `${e.description}: €${e.amount.toFixed(2)} (von ${e.paidBy})`;
          expenseList.appendChild(li);
        });
    }
  
    function renderSummary(): void {
      if (!currentGroup) return;
      const balances: { [member: string]: number } = {};
      const members = currentGroup.members;
  
      expenses
        .filter(e => e.groupName === currentGroup!.name)
        .forEach(exp => {
          const split = exp.amount / members.length;
          members.forEach(name => {
            if (!balances[name]) balances[name] = 0;
            if (name === exp.paidBy) {
              balances[name] += exp.amount - split;
            } else {
              balances[name] -= split;
            }
          });
        });
  
      summaryList.innerHTML = "";
      Object.entries(balances).forEach(([name, balance]) => {
        const li = document.createElement("li");
        li.textContent = `${name} ${balance >= 0 ? "bekommt" : "schuldet"} €${Math.abs(balance).toFixed(2)}`;
        summaryList.appendChild(li);
      });
    }
  
    
    renderGroups();
    updatePersonDropdown();
    renderExpenses();
    renderSummary();
  });
  