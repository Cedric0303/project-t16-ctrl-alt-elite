const DISCOUNTVALUE = 20 / 100 // 20%

function removeunderscore(input) {
    var newinput = input.replace("_", " ");
    return newinput;
}

function formatDatePrevOrders(datetime) {
    var dt = new Date(datetime);
    formatted = "";
    ampm = "";
    month = dt.toLocaleString('en-AU', {month: 'short' });
    day = dt.getDate();
    date = dt.toDateString();
    time = dt.toLocaleTimeString("default", {
        timeZone: "Australia/Melbourne",
        hour: '2-digit', 
        minute:'2-digit',
    
    });

    formatted = time.toUpperCase() + " " + month + " " + day;
    return formatted;
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

// accepts time in seconds and returns a formatted string
function secondsToText(time) {
    hours = Math.floor(time/3600)
    minutes = Math.floor(time/60)
    seconds = time%60
    if (hours != 0) {
        return hours+"hr "+String(minutes).padStart(2, '0')+"min "+String(seconds).padStart(2, '0')+"s elapsed"
    } else if (minutes != 0) {
        return minutes+"m "+String(seconds).padStart(2, '0')+"s elapsed"
    } else {
        return String(seconds).padStart(2, '0')+"s elapsed"
    }
}

// returns total seconds from order placed -> order made
function timeElapsedMade(order) {
    orderTime = new Date(order.timestamp)
    orderFulfillTime = new Date(order.fulfilledTimestamp)
    totalSeconds = Math.round((orderFulfillTime.getTime() -  orderTime.getTime()) / 1000)
    return totalSeconds
}

// returns total seconds from order made -> order collected
function timeElapsedCollected(order) {
    orderFulfillTime = new Date(order.fulfilledTimestamp)
    orderCompletedTime = new Date(order.completedTimestamp)
    totalSeconds = Math.round((orderCompletedTime.getTime() -  orderFulfillTime.getTime()) / 1000)
    return totalSeconds
}

// returns string for total
function totalString(order) {
    if (order.discounted) {
        return "$"+Number(order.orderTotal).toFixed(2) + " <span style=\"color:#ef5658\"><s>$" + Number(getOgTotal(order.orderTotal)).toFixed(2) + "</s> (Discount Applied)</span>"
    } else {
        return "$"+Number(order.orderTotal).toFixed(2)
    }
}

// cache DOM elements
pastOrders = document.getElementsByClassName('pastOrder')
searchbar = document.getElementById('searchbar')
pastOrderDetails = document.getElementById('pastOrderDetails')
pastOrderID = document.getElementById('pastOrderID')
pastOrderName = document.getElementById('pastOrderName')
pastOrderUsername = document.getElementById('pastOrderUsername')
pastOrderTimestamp = document.getElementById('pastOrderTimestamp')
pastOrderVanName = document.getElementById('pastOrderVanName')
pastOrderItems = document.getElementById('pastOrderItems')
pastOrderTotal = document.getElementById('pastOrderTotal')
pastOrderFulfillTime = document.getElementById('pastOrderFulfillTime')
pastOrderFulfillTimeElapsed = document.getElementById('pastOrderFulfillTimeElapsed')
pastOrderCompleteTime = document.getElementById('pastOrderCompleteTime')
pastOrderCompleteTimeElapsed = document.getElementById('pastOrderCompleteTimeElapsed')
pastOrderRating = document.getElementById('pastOrderRating')
pastOrderReview = document.getElementById('pastOrderReview')
pastOrderIDbottom = document.getElementById('pastOrderIDbottom')

function displayOrder(element) {
    order = orders[element.dataset.index];
    pastOrderDetails.style.display = "block";
    pastOrderID.innerHTML = order.orderID;
    pastOrderName.innerHTML = order.customerGivenName;
    pastOrderUsername.innerHTML = order.customerID;
    pastOrderTimestamp.innerHTML = formatDate(order.timestamp);
    pastOrderVanName.innerHTML = removeunderscore(order.vendorID);
    itemsHTML = ""
    for (i in order.item) {
        itemsHTML += 
            "<div class=\"pastOrderItem\">"+
                "<div class=\"justifyLeft\">"+order.item[i].name+"</div>"+
                "<div>"+order.item[i].price+"</div>"+
                "<div>"+order.item[i].count+"</div>"+
                "<div>"+order.item[i].total+"</div>"+
            "</div>"
    }
    pastOrderItems.innerHTML = itemsHTML;
    pastOrderTotal.innerHTML = totalString(order);
    pastOrderFulfillTime.innerHTML = formatDate(order.fulfilledTimestamp);
    pastOrderFulfillTimeElapsed.innerHTML = secondsToText(timeElapsedMade(order));
    pastOrderCompleteTime.innerHTML = formatDate(order.completedTimestamp);
    pastOrderCompleteTimeElapsed.innerHTML = secondsToText(timeElapsedCollected(order));
    if (order.rating != undefined) {
        pastOrderRating.innerHTML = order.rating+"/5"
    } else {
        pastOrderRating.innerHTML = "n/a"
    }
    if (order.review != undefined) {
        pastOrderReview.innerHTML = order.review
    } else {
        pastOrderReview.innerHTML = "n/a"
    }
    pastOrderIDbottom.innerHTML = order.orderID;
}

function selectOrder(element) {
    if (!element.classList.contains('selected')) {
        for (var i=0; i<pastOrders.length; i++) {
            pastOrders[i].classList.remove('selected');
        }
        element.classList.add('selected')
        displayOrder(element)
    } else {
        for (var i=0; i<pastOrders.length; i++) {
            pastOrders[i].classList.remove('selected');
        }
        pastOrderDetails.style.display = "none";
    }
}

// register orders with select order function
for (var i=0; i<pastOrders.length; i++) {
    pastOrders[i].addEventListener('click', function() {
        selectOrder(this)
    })
}

// filter menu by categories
function filterOrders() {
    var searchTerm = searchbar.value;
    var regex = new RegExp(`^${searchTerm}`, 'i');
    for(var i = 0; i < pastOrders.length; i++){
        if (searchTerm != "") {
            console.log(searchTerm);
            // if current order id is not a match, hide it
            if(!(regex).test(pastOrders[i].dataset.id)){
                pastOrders[i].style.display = 'none';
            } else {
                pastOrders[i].style.display = 'grid';
            }
        } else {
            pastOrders[i].style.display = 'grid';
        }
    }
}

// write in search bar
searchbar.addEventListener("input", filterOrders)