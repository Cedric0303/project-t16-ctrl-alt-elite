function liveStatus(orderinfo) {
    req = new XMLHttpRequest()
    req.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // update html page
            document.getElementById('orderStatusText').innerHTML = this.response
        }
    }
    req.open("GET", "/customer/orders/" + orderinfo.orderID + "/status/live")
    req.send();
}
totalTime = 0
function timeElapsed(orderinfo,  totalTime) {
    if (!totalTime) {
        orderTime = new Date(orderinfo.timestamp)
        totalTime = Math.round((new Date().getTime() -  orderTime.getTime()) / 1000)
    }
    else totalTime += 1
    minute = Math.floor(totalTime / 60)
    seconds = totalTime % 60
    document.getElementById('timeElapsed').innerHTML = 'Time elapsed: ' + minute + 'm, ' + seconds + 'sec'
}

document.getElementById('timeElapsed').innerHTML = 'Time elapsed: Xm, Xsec'
document.getElementById('orderStatusText').innerHTML = orderinfo.orderStatus
setInterval(function () {
    liveStatus(orderinfo)
}, 10000)
setInterval(()=> {
    timeElapsed(orderinfo, totalTime)
}, 1000)
