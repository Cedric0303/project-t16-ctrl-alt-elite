changeColor = function () {
    var container = document.getElementsByClassName("orderbox-container")
    var targets = document.getElementsByClassName('orderstatus')
    for (var i = 0; i < targets.length; i++) {
        if (targets[i].innerHTML == "Ordering") { 
            container[i].style.backgroundColor = "#FFFEEB"
            targets[i].style.color = "#8F3900";
            targets[i].innerHTML = "Pending"
        } else if (targets[i].innerHTML == "Fulfilled") {
            container[i].style.backgroundColor = "#EBFFEB"
            targets[i].style.color = "#445D04"
            targets[i].innerHTML = "Ready for pickup"
        } else {
            targets[i].innerHTML = ""
        }
    }
}

formatDate = function (datetime) {
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

removeunderscore = function (input) {
    var newinput = input.replace("_", " ");
    return newinput;
}

toFixed2 = function (input) {
    var newinput = input.toFixed(2);
    return newinput;
}

changeColor()

const socket = io()
if (customerID != null) {
    socket.emit('customerID', customerID);
    socket.on('ordersChange', function (orders) {
        output = ""
        for (i in orders) {
            output += "<div class=\"orderElement\">"
                    + "<a class=\"hoverable orderbox-container\" href=\"orders/"+ orders[i].orderID + "\">"
                    + "<div class=\"orderdate\">" + formatDate(orders[i].timestamp) + "</div>"
                    + "<div class=\"ordercontent\">"
            for (j in orders[i].item) {
                item = orders[i].item[j]
                output += "<div class=\"orderitem\">"
                        + "<div>" + orders[i].item[j].count + "x</div>"
                        + "<div>" + orders[i].item[j].name + "</div>"
                        + "<div>$" + toFixed2(orders[i].item[j].total) + "</div>"
                        + "</div>"
            }
            output += "</div>"
                    + "<div class=\"ordertotal\">Order Total: $" + toFixed2(orders[i].orderTotal) + "</div>"
                    + "<div class=\"orderstatus\">" + orders[i].orderStatus + "</div>"
                    + "<div class=\"ordertrailer\">"
                    + "<div>" + removeunderscore(orders[i].vendorID) + "</div>"
                    + "</div>"
                    + "</a>"
                    + "<a class=\"viewonMap hoverable\" href=\"/customer/van/" + orders[i].vendorID + "\">View On Map</a>"
                    + "</div>"
        }
        document.getElementById("customerOrders").innerHTML = output
        changeColor()
    })
}