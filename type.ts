document.addEventListener("DOMContentLoaded", () => {
    
    const createGroupBtn = document.getElementById("createGroup") as HTMLButtonElement;
    const groupList = document.getElementById("groupList") as HTMLUListElement;
    
    let groups: string[] = [];
  
    createGroupBtn.addEventListener("click", () => {
      console.log("Gruppe erstellen");
    });
  });