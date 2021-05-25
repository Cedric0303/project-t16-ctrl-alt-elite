const socket = io()
socket.emit('vanID', van.loginID);
socket.on('orderChange', function (orders) {
    console.log(orders)
    output = ""
    for (i in orders) {
        // console.log(orders[i])
        output += "<div class=\"order\">"
                + "<div>" + orders[i].orderID + "</div>"
                + "<div>" + orders[i].orderStatus + "</div>"
                + "<div>" + orders[i].customerGivenName + "</div>"
        for (j in orders[i].item) {
            item = orders[i].item[j]
            // console.log(item)
            output += "<div class=\"orderitem\">"
                    + "<div>" + orders[i].item[j].count + "x</div>"
                    + "<div>" + orders[i].item[j].name + "</div>"
                    + "<div>$" + Number(orders[i].item[j].total).toFixed(2) + "</div>"
                    + "</div>"
        }
        output += "</div>"
    }
    document.getElementById("currentOrders").innerHTML = output
})