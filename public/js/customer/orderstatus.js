const MODIFYTIME = 10 * 60 // 10 minutes
const DISCOUNTVALUE = 20 / 100 // 20%
const DISCOUNTTIME = 15 * 60 // 15 minutes

cancelModifyOrderButton = document.getElementById('cancelModifyOrderButton')

var totalSeconds = 0
// calculates time elapsed since order made
function timeElapsed(orderinfo,  totalSeconds) {
    time = totalSeconds
    if (!totalSeconds) {
        orderTime = new Date(orderinfo.timestamp)
        totalSeconds = Math.round((new Date().getTime() -  orderTime.getTime()) / 1000)
    }
    else totalSeconds += 1
    hour = Math.floor(totalSeconds / 3600)
    time = totalSeconds % 3600
    minute = Math.floor(time / 60)
    second = time % 60

    // check if 10 minute window for modifiable order has expired
    if (totalSeconds >= MODIFYTIME) {
        cancelModifyOrderButton.classList.add("disabled");
    } else {
        cancelModifyOrderButton.classList.remove("disabled");
    }

    setTimeElapsed(hour, minute, second, "elapsed")
    updateTotal(totalSeconds)
}

// calculate time elapsed till order fulfilled
function fulfillTime(orderinfo, totalSeconds) {
    time = totalSeconds
    orderTime = new Date(orderinfo.timestamp)
    fulfilledTime = new Date(orderinfo.fulfilledTimestamp)
    totalSeconds = Math.round((fulfilledTime.getTime() -  orderTime.getTime()) / 1000)
    hour = Math.floor(totalSeconds / 3600)
    time = totalSeconds % 3600
    minute = Math.floor(time / 60)
    second = time % 60
    setTimeElapsed(hour, minute, second, "fulfilled")
    cancelModifyOrderButton.classList.add("disabled");
    updateTotal(totalSeconds)
}

// calculate time elapsed till order completed
function completeTime(orderinfo, totalSeconds) {
    time = totalSeconds
    orderTime = new Date(orderinfo.timestamp)
    completedTime = new Date(orderinfo.completedTimestamp)
    totalSeconds = Math.round((completedTime.getTime() -  orderTime.getTime()) / 1000)
    hour = Math.floor(totalSeconds / 3600)
    time = totalSeconds % 3600
    minute = Math.floor(time / 60)
    second = time % 60
    setTimeElapsed(hour, minute, second, "completed")
    cancelModifyOrderButton.classList.add("disabled");

    console.log(totalSeconds);
    fulfilledTime = new Date(orderinfo.fulfilledTimestamp)
    fulfilledTimeSeconds = Math.round((fulfilledTime.getTime() -  orderTime.getTime()) / 1000)
    updateTotal(fulfilledTimeSeconds)
}

// updates the text for time elapsed on the screen
function setTimeElapsed(hour, minute, second, type) {
    if (!hour) {
        document.getElementById('timeElapsed').innerHTML = 'Time '+type+': ' + minute + 'm, ' + second + 'sec'
    }
    else {
        document.getElementById('timeElapsed').innerHTML = 'Time '+type+': '+ hour + 'h, ' + minute + 'm, ' + second + 'sec'
    }
}

// returns original, undiscounted total
function getOgTotal(price) {
    return Number(price/(1-DISCOUNTVALUE)).toFixed(2)
}

// updates order total text on the screen
// time is total time elapsed in seconds
orderTotalText = document.getElementById('orderTotal')
function updateTotal(time) {
    // if discount applied, display discounted total
    if (time >= DISCOUNTTIME) {
        orderTotalText.innerHTML = "Order Total: $" + Number(orderinfo.orderTotal).toFixed(2) + " <span style=\"color:#ef5658\"><s>" + Number(getOgTotal(orderinfo.orderTotal)).toFixed(2) + "</s> (20% off)</span>"
    } else {
        orderTotalText.innerHTML = "Order Total: $" + Number(orderinfo.orderTotal).toFixed(2)
        orderTotalText.style.color = "#000000"
    }
    
}

timeInterval = setInterval(()=> {
    if (orderinfo["orderStatus"] == "Fulfilled") {
        fulfillTime(orderinfo, totalSeconds)
        clearInterval(timeInterval)
    } else if (orderinfo["orderStatus"] == "Completed") {
        completeTime(orderinfo, totalSeconds)
        clearInterval(timeInterval)
    } else {
        timeElapsed(orderinfo, totalSeconds)
    }
}, 1000)

function setStatus(order) {
    // changes the visible status on the page (the icon and active text)
    // status is a string with the order status
    // e.g. Ordering, Fulfilled
    switch (order.orderStatus) {
        case "Ordering":
            document.getElementById('ordericon').innerHTML = "<i class=\"fas fa-coffee\"></i>";
            document.getElementById('ordericon').className = 'bouncyAnim';
            document.getElementById('orderOrdering').style.color = "#fe773c";
            document.getElementById('orderFulfilled').style.color = "black";
            break;
        case "Fulfilled":
            document.getElementById('ordericon').innerHTML = "<i class=\"far fa-check-circle\"></i>";
            document.getElementById('ordericon').className = '';
            document.getElementById('orderOrdering').style.color = "black";
            document.getElementById('orderFulfilled').style.color = "#0bc90e";
            document.getElementById('orderTotal').innerHTML = "Order Total: $" + Number(order.orderTotal).toFixed(2)
            break;       
        case "Completed":
            // if the order has a review then show the detailed order info
            if ((order.review != "" || order.rating != "") && (order.review != undefined || order.rating != undefined)) {
                if (order.rating == "") {
                    rating = "n/a"
                } else {
                    rating = order.rating + " out of 5" 
                }
                if (order.review == "") {
                    review = "n/a"
                } else {
                    review = order.review
                }
                document.getElementById('cancelModifyOrderButton').classList.add("disabled");
                document.getElementById('vanfloatleft').querySelector("p").innerHTML = "ORDERED FROM";
                document.getElementById('orderTitle').firstChild.innerHTML = "Your review";
                document.getElementById('orderStatus').style.fontSize = "1em";
                document.getElementById('orderStatus').innerHTML = 
                    "<div><b>Rating:</b> "+rating+"</div>"+
                    "<div><b>Comment:</b> "+review+"</div>";
            } else {
                // redirect user to add review for specified order
                document.getElementById('orderTitle').firstChild.innerHTML = "Your order is completed"
                document.getElementById('orderStatus').style.fontSize = "1em";
                document.getElementById('orderStatus').innerHTML = "Redirecting to review page"
                setTimeout(() => {
                    window.location.href = window.location + '/review'
                }, 6000)
            }
            break;
        default:
            console.log("Error setting status.");
            break;
    }
}

document.getElementById('cancelModifyOrderButton').href = window.location + "/modify"

setStatus(orderinfo)

const socket = io()
socket.emit('orderID', orderinfo.orderID);
socket.on('statusChange', function (order) {
    orderinfo = JSON.parse(order)
    setStatus(orderinfo);
})