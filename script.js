const mainContainer = document.querySelector(".main_cont");
const pendingTaskContainer = document.querySelector(".pending-cont");
const finishedTaskContainer = document.querySelector(".finished-cont");
const toolboxSelector = document.querySelector(".toolbox-priority-cont");
const addButton = document.querySelector(".add-btn");
const deleteButton = document.querySelector(".remove-btn");
const modalContainer = document.querySelector(".modal-cont");
const priorityColorContainer = modalContainer.querySelector(".priority-color-cont");
const allPriorityColorDiv = priorityColorContainer.querySelectorAll(".priority-color");
const colorArray = ["pink", "blue", "purple", "green"];
let activeColor = "green";
let deleteFlag = false;
let store = JSON.parse(localStorage.getItem("taskTickets")) || [];
populateUI();
addButton.addEventListener('click', () => {
    modalContainer.style.display = "flex";
});
deleteButton.addEventListener('click', () => {
    const image = deleteButton.querySelector("i");
    deleteFlag = true;
    image.style.color = "red";
});
mainContainer.addEventListener('click', (e) => {    
    if (e.target.classList.contains("ticket-area") && deleteFlag) {
        const parent = e.target.parentElement;
        const ticketId = parent.querySelector(".ticket-id").innerText;
        parent.remove();
        const image = deleteButton.querySelector("i");
        deleteFlag = false;
        image.style.color = "black";
        updateStore(ticketId,"","removeTicket");
    }
});
modalContainer.addEventListener('keyup', (e) => {
    if (e.key === "Enter") {
        const taskName = (modalContainer.querySelector(".textarea-cont")).value;
        const uniqueId = new ShortUniqueId()();
        const fragment = createNewTaskCard(taskName, activeColor, uniqueId);
        const obj = {
            id: uniqueId,
            color: activeColor,
            taskName: taskName,
            isPending: true
        }
        store.push(obj);
        updateLocalStorage();
        createEventListeners(fragment);
        pendingTaskContainer.appendChild(fragment);
        resetModalContainer();
    }
    else if (e.key === "Escape") {
        modalContainer.style.display = "none";
        resetModalContainer();
    }
});
priorityColorContainer.addEventListener('click', (e) => {
    if (e.target != e.currentTarget) {
        const colorSelected = e.target.classList[1];
        allPriorityColorDiv.forEach((v) => {
            if ((v.classList[1]) != colorSelected) {
                v.classList.remove("active");
            }
            else {
                v.classList.add("active");
            }
        });
        activeColor = colorSelected;
    }
});
toolboxSelector.addEventListener('click', (e) => {
    if (!(e.target === e.currentTarget)) {
        const selectedColor = (e.target.classList)[1];
        filterMainContainer(selectedColor);
    }
});
toolboxSelector.addEventListener('dblclick', (e) => {
    if (!(e.target === e.currentTarget)) {
        const allTasks = getAllTasks();
        displayAllTasks(allTasks);
    }
});
function createNewTaskCard(taskName, color, uniqueId) {
    //console.log(uniqueId);
    const fragment = document.createDocumentFragment();
    const parentDiv = document.createElement("div");
    parentDiv.setAttribute("class", "ticket-cont");
    const ticketColor = document.createElement("div");
    ticketColor.setAttribute("class", `ticket-color ${color}`);
    const ticketId = document.createElement("div");
    ticketId.setAttribute("class", "ticket-id");
    ticketId.innerText = uniqueId;
    const textArea = document.createElement("div");
    textArea.setAttribute("class", "ticket-area");
    textArea.innerText = taskName.trim();
    const IconDiv = document.createElement("div");
    IconDiv.setAttribute("class", "lock-unlock");
    const image = document.createElement("i");
    image.setAttribute("class", "fa-solid fa-lock");
    IconDiv.appendChild(image);
    parentDiv.appendChild(ticketColor);
    parentDiv.appendChild(ticketId);
    parentDiv.appendChild(textArea);
    parentDiv.appendChild(IconDiv);
    setDraggble(parentDiv);
    fragment.appendChild(parentDiv);
    return fragment;
}
function createEventListeners(fragment) {
    const ticketId = fragment.querySelector(".ticket-id").innerText;    
    const ticketColorDiv = fragment.querySelector(".ticket-color");
    const ticketArea = fragment.querySelector(".ticket-area");
    const lockUnlockButton = fragment.querySelector(".lock-unlock");
    const icon = lockUnlockButton.querySelector("i");
    ticketColorDiv.addEventListener('click', () => {
        const currentColor = (ticketColorDiv.classList)[1];
        const colorIndex = colorArray.findIndex(v => v === currentColor);
        const nextIndex = (colorIndex + 1) % (colorArray.length);
        ticketColorDiv.classList.remove(currentColor);
        ticketColorDiv.classList.add(colorArray[nextIndex]);
        console.log(colorArray[nextIndex]);
        updateStore(ticketId, colorArray[nextIndex], "updateColorInStore");
    });
    lockUnlockButton.addEventListener('click', () => {
        icon.setAttribute("class", "fa-solid fa-unlock");
        ticketArea.setAttribute("contenteditable", "true");
    });
    ticketArea.addEventListener('keypress', (e) => {
        if (e.key === "Enter") {
            const updateText = ticketArea.innerText;
            icon.setAttribute("class", "fa-solid fa-lock");
            ticketArea.setAttribute("contenteditable", "false")
            ticketArea.innerText = updateText;
            updateStore(ticketId,updateText,"updateTaskName");
        }
    });
}
function filterMainContainer(color) {
    const allTasks = getAllTasks();
    displayAllTasks(allTasks);
    allTasks.forEach((v) => {
        const eachTask = v.querySelector(".ticket-color");
        const colorOfEachTask = (eachTask.classList)[1];
        if (colorOfEachTask != color) {
            v.style.display = "none";
        }
    });
}
function getAllTasks() {
    const allTaskList = document.querySelectorAll(".ticket-cont");
    return allTaskList;
}
function displayAllTasks(allNodes) {
    allNodes.forEach((v) => {
        v.style.display = "block";
    })
}
function resetModalContainer() {
    (modalContainer.querySelector(".textarea-cont")).value = "";
    allPriorityColorDiv.forEach((v) => {
        if ((v.classList[1]) === "green") {
            v.classList.add("active");
        }
        else {
            v.classList.remove("active");
        }
    });
    activeColor = "green";
    modalContainer.style.display = "none";
}
function updateLocalStorage() {
    const stringifiedValue = JSON.stringify(store);
    localStorage.setItem("taskTickets", stringifiedValue);
}
function populateUI() {
    if (!!store) {
        store.forEach((ticket) => {
            const id = ticket.id;
            const color = ticket.color;
            const taskName = ticket.taskName;
            const fragment = createNewTaskCard(taskName, color, id);
            createEventListeners(fragment);
            if (ticket.isPending) {
                pendingTaskContainer.appendChild(fragment);
            }
            else {
                finishedTaskContainer.appendChild(fragment);
            }
        });
    }
}
function updateStore(uId, updateValue, updateItem) {
    switch (updateItem) {
        case "updateColorInStore":
            store.forEach((ticket) => {
                if (ticket.id === uId) {
                    ticket.color = updateValue;
                }
            });
            localStorage.setItem("taskTickets",JSON.stringify(store));
            break;
        case "updateTaskName":
            store.forEach((ticket)=>{
                if(ticket.id === uId){
                    ticket.taskName = updateValue;
                }
            });
            localStorage.setItem("taskTickets",JSON.stringify(store));
            break;
        case "removeTicket":
            let newStore = store.filter((ticket)=>{
                if(ticket.id === uId){
                    return false;
                }
                else{
                    return true;
                }
            });
            localStorage.setItem("taskTickets", JSON.stringify(newStore));
            store = newStore;
            newStore=null;  
            break;
        case "updateTicketStatus":
            store.forEach((ticket)=>{
                if(ticket.id === uId){
                    ticket.isPending = updateValue;
                }
            });
            updateLocalStorage();
            break;          
        default:
            break;
    }
}