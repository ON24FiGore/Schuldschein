document.addEventListener("DOMContentLoaded", () => {
    const createGroupBtn = document.getElementById("createGroup") as HTMLButtonElement;
    const groupList = document.getElementById("groupList") as HTMLUListElement;
    const personSelect = document.getElementById("personSelect") as HTMLSelectElement;
    const expenseForm = document.getElementById("expenseForm") as HTMLFormElement;
    const expenseList = document.getElementById("expenseList") as HTMLUListElement;
    const summaryList = document.getElementById("summaryList") as HTMLUListElement;
  
    interface Group { name: string; members: string[]; }
  interface Expense { description: string; amount: number; paidBy: string; }
  let groups: Group[] = [];
  let currentGroup: Group | null = null;
  let expenses: Expense[] = [];

  const modal = document.createElement("div");
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
});