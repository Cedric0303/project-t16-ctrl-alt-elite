var xhttp = new XMLHttpRequest(); 
orderBoxes = document.getElementsByClassName('order')
orderMadeButton = document.getElementById('orderMadeButton')
orderCollectedButton = document.getElementById('orderCollectedButton')
expandOrderButton = document.getElementById('expandOrder')

selectedOrderIndex = null;
function selectOrder() {
    // update visual border indicator for selected order
    for (var i=0; i<orderBoxes.length; i++) {
        if (orderBoxes[i] != this) {
            // deselect all other orders that wasn't the clicked order
            orderBoxes[i].classList.remove("orderSelected")
        } else {
            // toggle the clicked order selection
            if(!orderBoxes[i].classList.toggle("orderSelected")) {
                // if the order was deselected then set selectedOrderIndex to null
                selectedOrderIndex = null;
            } else {
                selectedOrderIndex = i;
            }
        }
    }

    // if an order is selected
    updateStatusButtons();
}

function updateStatusButtons() {
    if (selectedOrderIndex != null) {
        // get status of selected order
        orderStatus = ordersArray[selectedOrderIndex].orderStatus

        // enable appropriate order status buttons
        switch (orderStatus) {
            case "Ordering":
                orderMadeButton.disabled = false;
                orderCollectedButton.disabled = true;
                break;
            case "Fulfilled":
                orderMadeButton.disabled = true;
                orderCollectedButton.disabled = false;
                break;
            default:
                console.log("Error getting status of selected order.");
                break;
        }
    } else {
        orderMadeButton.disabled = true;
        orderCollectedButton.disabled = true;
    }
}

function expandOrder(type) {
    // opens modal of selectedOrderIndex
    // type is one of ['notMade','Made']
}

function setStatusMade() {
    if (selectedOrderIndex != null) {
        orderid = ordersArray[selectedOrderIndex].orderID
        xhttp.open("POST", "orders/fulfill/"+orderid, true);
        xhttp.send();
        selectedOrderIndex = null;
        updateStatusButtons();
    }
}

function setStatusCollected() {
    if (selectedOrderIndex != null) {
        orderid = ordersArray[selectedOrderIndex].orderID
        xhttp.open("POST", "orders/complete/"+orderid, true);
        xhttp.send();
        selectedOrderIndex = null;
        updateStatusButtons();
    }
}

// ----------------register functions---------------------
orderMadeButton.addEventListener("click", setStatusMade)
orderCollectedButton.addEventListener("click", setStatusCollected)
expandOrderButton.addEventListener("click", expandOrder)

function registerOrderFunctions() {
    // register order selection function
    for (var i=0; i<orderBoxes.length; i++) {
        orderBoxes[i].addEventListener("click", selectOrder)
    }
}
registerOrderFunctions();

// ---------------live update code--------------
const socket = io()
socket.emit('vanID', van.loginID);
socket.on('orderChange', function (orders) {
    ordersArray = orders;
    output = "";
    for (i in orders) {
        output += "<div class=\"order hoverable\">"
                + "<div class=\"orderHeader\">Order for&nbsp;<span class=\"customerName\">"+orders[i].customerGivenName+"</span></div>"
                + "<div class=\"orderitems\">"
        for (j in orders[i].item) {
            item = orders[i].item[j]
            output += "<div class=\"orderitem\">"
                        + "<div class=\"orderitemname\">"+ orders[i].item[j].name +"</div>"
                        + "<div class=\"orderitemcount\">x"+orders[i].item[j].count+"</div>"
                    + "</div>"
        }
        output += "</div>"
                +"</div>"
    }
    document.getElementById("currentOrders").innerHTML = output
    registerOrderFunctions();
})