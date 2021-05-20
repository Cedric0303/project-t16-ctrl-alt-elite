var totalTime = 0
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
setInterval(()=> {
    timeElapsed(orderinfo, totalTime)
}, 1000)


const socket = io()
socket.emit('orderID', orderinfo.orderID);
socket.on('statusChange', function (orderStatus) {
    document.getElementById('orderStatusText').innerHTML = orderStatus
    console.log(orderStatus)
})