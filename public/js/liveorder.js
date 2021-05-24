var totalSeconds = 0
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

function setTimeElapsed(hour, minute, second) {
    if (!hour) {
        document.getElementById('timeElapsed').innerHTML = 'Time elapsed: ' + minute + 'm, ' + second + 'sec'
    }
    else {
        document.getElementById('timeElapsed').innerHTML = 'Time elapsed: '+ hour + 'h, ' + minute + 'm, ' + second + 'sec'
    }
}

if (document.getElementById('orderStatusText').innerHTML != 'Completed') {
    setInterval(()=> {
        timeElapsed(orderinfo, totalSeconds)
    }, 1000)
}
else {
    completeTime(orderinfo, totalSeconds)
}

const socket = io()
socket.emit('orderID', orderinfo.orderID);
socket.on('statusChange', function (orderStatus) {
    document.getElementById('orderStatusText').innerHTML = orderStatus
    console.log(orderStatus)
})