// Time limit window for order modifiability in seconds
var orderModifiableTime = 600


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
    if (totalSeconds > orderModifiableTime) {
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

function setStatus(status) {
    // changes the visible status on the page (the icon and active text)
    // status is a string with the order status
    // e.g. Ordering, Fulfilled
    switch (status) {
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
            break;       
        default:
            console.log("Error setting status.");
            break;
    }
}

document.getElementById('cancelModifyOrderButton').href = window.location + "/modify"

setStatus(orderinfo["orderStatus"])

const socket = io()
socket.emit('orderID', orderinfo.orderID);
socket.on('statusChange', function (orderStatus) {
    orderinfo["orderStatus"] = orderStatus;
    setStatus(orderStatus);
    // document.getElementById('orderStatusText').innerHTML = orderStatus;
    console.log(orderStatus);
})