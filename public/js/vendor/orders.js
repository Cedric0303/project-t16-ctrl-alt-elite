const DISCOUNTVALUE = 20 / 100 // 20%
const DISCOUNTTIME = 15 * 60 // 15 minutes

var xhttp = new XMLHttpRequest(); 
orderBoxes = document.getElementsByClassName('order')
orderMadeButton = document.getElementById('orderMadeButton')
orderCollectedButton = document.getElementById('orderCollectedButton')
expandOrderButton = document.getElementById('expandOrder')
currentOrdersElement = document.getElementById("currentOrders")

// modal
modal = document.getElementById("orderModal");
modalOrderID = document.getElementById('modalOrderID')
modalOrderName = document.getElementById('modalOrderName')
orderTimestamp = document.getElementById('orderTimestamp')
orderTimeTilDisc = document.getElementById('orderTimeTilDisc')
timeDisc = document.getElementById('timeDisc')
orderTimeElapsed = document.getElementById('orderTimeElapsed')
orderStatusText = document.getElementById('orderStatusText')
modalOrderItems = document.getElementById('modalOrderItems')
modalOrderSubtotal = document.getElementById('modalOrderSubtotal')
discountAppliedText = document.getElementById('discountAppliedText')

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
                // if orderSelected was added i.e. order was selected
                selectedOrderIndex = i;
                updateModal(selectedOrderIndex);
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

function formatDate(datetime) {
    var dt = new Date(datetime);
    formatted = "";
    ampm = ""
    date = dt.toDateString();
    time = dt.toLocaleTimeString("en-AU", {
        timeZone: "Australia/Melbourne",
        hour: '2-digit', 
        minute:'2-digit'
    });

    formatted = date+" at "+time;
    return formatted;
}

function getOgTotal(price) {
    return Number(price/(1-DISCOUNTVALUE)).toFixed(2)
}
function getDiscountedTotal(price) {
    return Number(price-(price*DISCOUNTVALUE)).toFixed(2)
}

function updateModal(orderindex) {
    orderstatus = ordersArray[orderindex].orderStatus
    if (orderstatus == "Ordering") {
        countdown(orderTimeTilDisc, DISCOUNTTIME-timeElapsed(ordersArray[orderindex]));
        orderStatusText.innerHTML = "Order Not Made"
        orderStatusText.style.color = "#ff3b30";
    } else {
        timeDisc.style.display = "none";
        orderStatusText.innerHTML = "Waiting for Pickup"
        orderStatusText.style.color = "#4cd964";
    }
    modalOrderID.innerHTML = ordersArray[orderindex].orderID
    orderTimestamp.innerHTML = formatDate(ordersArray[orderindex].timestamp)
    countupModal(orderTimeElapsed, timeElapsed(ordersArray[orderindex]));
    orderitems = ""
    for (i in ordersArray[orderindex].item) {
        item = ordersArray[orderindex].item[i]
        orderitems += "<div class=\"modalOrderItem\">"
                        + "<div>" + ordersArray[orderindex].item[i].name + "</div>"
                        + "<div class=\"orderitemcount\">" + ordersArray[orderindex].item[i].count + "x</div>"
                        + "<div class=\"orderitemtotal\">$" + (ordersArray[orderindex].item[i].total).toFixed(2) + "</div>"
                    + "</div>"
    }
    modalOrderItems.innerHTML = orderitems
    if ((timeElapsed(ordersArray[orderindex]) >= DISCOUNTTIME)&&(orderstatus=="Ordering")) {
        timeDisc.style.display = "none";
        modalOrderSubtotal.innerHTML = "$"+(ordersArray[orderindex].orderTotal).toFixed(2)
        discountAppliedText.style.display = "block";
    } else {
        discountAppliedText.style.display = "none";
    }

    // if time is over discount time and the order is fulfilled
    if ((timeElapsed(ordersArray[orderindex]) >= DISCOUNTTIME) && (orderstatus=="Fulfilled")) {
        // show total from db with slashed og price
        modalOrderSubtotal.innerHTML = "$" + Number(ordersArray[orderindex].orderTotal).toFixed(2) + " <span style=\"color:#ef5658\"><s>$" + Number(getOgTotal(ordersArray[orderindex].orderTotal)).toFixed(2) + "</s> (20% off)</span>"
    // if time is over discount time and the other is not fulfilled (ordering)
    } else if ((timeElapsed(ordersArray[orderindex]) >= DISCOUNTTIME) && !(orderstatus=="Fulfilled")) {
        // show discounted total with total from db
        modalOrderSubtotal.innerHTML = "$" + Number(getDiscountedTotal(ordersArray[orderindex].orderTotal)).toFixed(2) + " <span style=\"color:#ef5658\"><s>$" + Number(ordersArray[orderindex].orderTotal).toFixed(2) + "</s> (20% off)</span>"
    } else {
        modalOrderSubtotal.innerHTML = "$"+Number(ordersArray[orderindex].orderTotal).toFixed(2)
        discountAppliedText.style.display = "none";
    }
}

function expandOrder() {
    // expands selected order into modal
    modal.style.display = "block";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
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
    var downinterval = setInterval(() => {
        // if time reaches 0, or if the element showing the time doesn't exist
        if ((time == 0) || (document.getElementById(element.id) == null)) {
            clearInterval(downinterval);
            if (time == 0) {
                updateOrderStatuses()
                updateModal(selectedOrderIndex)
            }
            return;
        // if the element showing the time is display: none;
        } else if (element.style.display == "none") {
            if (modal.style.display == "none") {
                clearInterval(downinterval);
                return;
            }
            time--;
        } else {
            time--;
        }
        element.innerHTML = secondsToMinutes(time)
    }, 1000);
}

function countup(element, time) {
    var upinterval = setInterval(() => {
        if (document.getElementById(element.id) != null) {
            time++;
        } else {
            clearInterval(upinterval);
            return;
        }
        element.innerHTML = secondsToMinutes(time);
    }, 1000);
}

function countupModal(element, time) {
    var upintervalmodal = setInterval(() => {
        if (modal.style.display == "none") {
            clearInterval(upintervalmodal);
        } else {
            time++;
            return;
        }
        element.innerHTML = secondsToMinutes(time);
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