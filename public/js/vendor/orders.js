const DISCOUNTVALUE = 20 / 100 // 20%
const DISCOUNTTIME = 15 * 60 // 15 minutes

var xhttp = new XMLHttpRequest(); 
orderBoxes = document.getElementsByClassName('order')
orderMadeButton = document.getElementById('orderMadeButton')
orderCollectedButton = document.getElementById('orderCollectedButton')
expandOrderButton = document.getElementById('expandOrder')
currentOrdersElement = document.getElementById("currentOrders")

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
        expandOrderButton.disabled = false;
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
        expandOrderButton.disabled = true;
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

// accepts time in seconds and returns a string in the form
// minutes:seconds
function secondsToMinutes(time) {
    minutes = Math.floor(time/60)
    seconds = time%60
    return minutes+":"+String(seconds).padStart(2, '0')
}

// returns total seconds since order was placed
function timeElapsed(order) {
    orderTime = new Date(order.timestamp)
    totalSeconds = Math.round((new Date().getTime() -  orderTime.getTime()) / 1000)
    return totalSeconds
}

// returns total seconds since order was made
function timeElapsedMade(order) {
    orderTime = new Date(order.fulfilledTimestamp)
    totalSeconds = Math.round((new Date().getTime() -  orderTime.getTime()) / 1000)
    return totalSeconds
}

// sets interval that updates "element" for "time" seconds
function countdown(element, time) {
    var interval = setInterval(() => {
        if (time == 0 || (document.getElementById(element.id) != null)) {
            clearInterval(interval);
            updateOrderStatuses();
            return;
        } else {
            time--;
        }
        element.innerHTML = secondsToMinutes(time)
        console.log("COUNTING DOWN: "+element.id);
    }, 1000);
}
function countup(element, time) {
    var interval = setInterval(() => {
        if (document.getElementById(element.id) != null) {
            time++;
        } else {
            clearInterval(interval);
            updateOrderStatuses();
            return;
        }
        element.innerHTML = secondsToMinutes(time);
        console.log("COUNTING UP: "+element.id);
    }, 1000);
}

function updateOrderStatuses() {
    for (var i=0; i<orderBoxes.length; i++) {
        currorder = ordersArray[i]
        orderStatus = currorder.orderStatus;
        orderStatusElement = orderBoxes[i].querySelector('.orderStatus')
        switch (orderStatus) {
            case "Ordering":
                if (timeElapsed(currorder) >= DISCOUNTTIME) {
                    orderStatusElement.innerHTML = "Discount Applied"
                    orderStatusElement.style.color = "#ff3b30"
                    orderStatusElement.style.fontFamily = "Roboto"
                    orderStatusElement.style.fontSize = "1.7em"
                    orderStatusElement.style.fontWeight = "700"
                    orderStatusElement.style.textAlign = "center" 
                } else {
                    orderStatusElement.innerHTML = 
                        "Time until Discount:"+
                        "<div id=\"dscntTimer"+currorder.orderID+"\" class=\"discountTimer\"></div>"
                    currDiscTimer = document.getElementById('dscntTimer'+currorder.orderID)
                    countdown(currDiscTimer, DISCOUNTTIME-timeElapsed(currorder));
                }
                break;
            case "Fulfilled":
                orderStatusElement.innerHTML = 
                    "Waiting for Pickup"+
                    "<div style=\"margin-top:3px;color:black; font-size:1rem;font-weight:500;\">Time Elapsed: <span id=\"madeTimer"+currorder.orderID+"\" class=\"madeTimer\"></span></div>"
                currMadeTimer = document.getElementById('madeTimer'+currorder.orderID)
                countup(currMadeTimer, timeElapsedMade(currorder));
                orderStatusElement.style.color = "#4cd964"
                orderStatusElement.style.fontFamily = "Roboto"
                orderStatusElement.style.fontSize = "1.5em"
                orderStatusElement.style.fontWeight = "700"
                orderStatusElement.style.textAlign = "center" 
                break;
            default:
                console.log("Error getting status of order "+currorder.orderID);
                break;
        }
    }
}
// run on load
updateOrderStatuses()

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
                        + "</div>"}
            output += "</div>"
            output += "<div class=\"orderStatus\"></div>"
        output += "</div>"
    }
    currentOrdersElement.innerHTML = output
    registerOrderFunctions();
    updateOrderStatuses()
})