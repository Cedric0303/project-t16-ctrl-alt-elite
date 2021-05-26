const MODIFYTIME = 10 * 60 // 10 minutes

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
    if (totalSeconds > MODIFYTIME) {
        document.getElementById('cancelModifyOrderButton').classList.add("disabled");
    } else {
        document.getElementById('cancelModifyOrderButton').classList.remove("disabled");
    }

    setTimeElapsed(hour, minute, second)
}

function completeTime(orderinfo, totalSeconds) {
    time = totalSeconds
    orderTime = new Date(orderinfo.timestamp)
    completedTime = new Date(orderinfo.completedTimestamp)
    totalSeconds = Math.round((completedTime.getTime() -  orderTime.getTime()) / 1000)
    hour = Math.floor(totalSeconds / 3600)
    time = totalSeconds % 3600
    minute = Math.floor(time / 60)
    second = time % 60
    setTimeElapsed(hour, minute, second)
}

// updates the text for time elapsed on the screen
function setTimeElapsed(hour, minute, second) {
    if (!hour) {
        document.getElementById('timeElapsed').innerHTML = 'Time elapsed: ' + minute + 'm, ' + second + 'sec'
    }
    else {
        document.getElementById('timeElapsed').innerHTML = 'Time elapsed: '+ hour + 'h, ' + minute + 'm, ' + second + 'sec'
    }
}

timeInterval = setInterval(()=> {
    if (orderinfo["orderStatus"] == "Fulfilled" || orderinfo["orderStatus"] == "Completed") {
        completeTime(orderinfo, totalSeconds)
        clearInterval(timeInterval)
    }
    timeElapsed(orderinfo, totalSeconds)
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
            document.getElementById('orderTotal').innerHTML = "$" + Number(order.orderTotal).toFixed(2)
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
    console.log(orderinfo);
    setStatus(orderinfo);
})