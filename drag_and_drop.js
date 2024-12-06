const container = document.querySelectorAll(".container");
let draggedItem = null;
function setDraggble(node){
    node.setAttribute("draggable",true);
}
container.forEach((statusComponent)=>{
    statusComponent.addEventListener('dragstart',(e)=>{
        draggedItem = e.target;
    });
    statusComponent.addEventListener('dragover',(e)=>{
        e.preventDefault();
    });
    statusComponent.addEventListener('drop',()=>{
        statusComponent.appendChild(draggedItem);
        const ticketId = draggedItem.querySelector(".ticket-id").innerText;        
        updateStore(ticketId,false,"updateTicketStatus");
    });
});
