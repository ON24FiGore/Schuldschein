document.addEventListener("DOMContentLoaded", () => {
    const createGroupBtn = document.getElementById("createGroup") as HTMLButtonElement;
    const groupList = document.getElementById("groupList") as HTMLUListElement;
    const personSelect = document.getElementById("personSelect") as HTMLSelectElement;
    const expenseForm = document.getElementById("expenseForm") as HTMLFormElement;
    const expenseList = document.getElementById("expenseList") as HTMLUListElement;
    const summaryList = document.getElementById("summaryList") as HTMLUListElement;
  
    interface Group {
      name: string;
      members: string[];
    }
    interface Expense {
      description: string;
      amount: number;
      paidBy: string;
    }
  
    let groups: Group[] = [];
    let currentGroup: Group | null = null;
    let expenses: Expense[] = [];
  });