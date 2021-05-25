toFixed2 = function (input) {
    var newinput = input.toFixed(2);
    return newinput;
}

const socket = io()
socket.emit('vanID', van.loginID);
socket.on('orderChange', function (orders) {
    output = ""
    for (i in orders) {
        output += "<div class=\"order\">"
                + "<div>" + orders[i].orderID + "</div>"
                + "<div>" + orders[i].orderStatus + "</div>"
                + "<div>" + orders[i].customerGivenName + "</div>"
        for (j in orders[i].item) {
            item = orders[i].item[j]
            output += "<div class=\"orderitem\">"
                    + "<div>" + orders[i].item[j].count + "x</div>"
                    + "<div>" + orders[i].item[j].name + "</div>"
                    + "<div>$" + toFixed2(orders[i].item[j].total) + "</div>"
                    + "</div>"
        }
        output += "</div>"
    }
    document.getElementById("currentOrders").innerHTML = output
})