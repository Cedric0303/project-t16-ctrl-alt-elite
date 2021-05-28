const DISCOUNTVALUE = 20 / 100 // 20%

ordersElement = document.getElementById("customerOrders")

changeColor = function () {
    var container = document.getElementsByClassName("orderbox-container")
    var targets = document.getElementsByClassName('orderstatus')
    for (var i = 0; i < targets.length; i++) {
        if (targets[i].innerHTML == "Ordering") { 
            container[i].style.backgroundColor = "#FFFEEB";
            targets[i].style.color = "#8F3900";
            targets[i].innerHTML = "Pending";
        } else if (targets[i].innerHTML == "Fulfilled") {
            container[i].style.backgroundColor = "#EBFFEB";
            targets[i].style.color = "#445D04";
            targets[i].innerHTML = "Ready for pickup";
        } else {
            targets[i].innerHTML = "";
            // targets[i].parentElement.classList.remove('hoverable');
            // targets[i].parentElement.removeAttribute("href");
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

// returns original, undiscounted total
function getOgTotal(price) {
    return Number(price/(1-DISCOUNTVALUE)).toFixed(2)
}

function ordertotalHtml(order) {
    console.log(order);
    output = ""
    if (order.discounted) {
        output += "Order Total: <br class=\"responsive\">$" + (order.orderTotal).toFixed(2) + "&nbsp;<span style=\"color:#ef5658\"><s>" + Number(getOgTotal(order.orderTotal)).toFixed(2) + "</s> (20% off)</span>"
    } else {
        output += "Order Total: $" + (order.orderTotal).toFixed(2)
    }
    return output;
}

function updateOrders(orders) {
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
                    + "<div>$" + (orders[i].item[j].total).toFixed(2) + "</div>"
                    + "</div>"
        }
        output += "</div>"
                + "<div class=\"ordertotal\">"+ordertotalHtml(orders[i])+"</div>"
                + "<div class=\"orderstatus\">" + orders[i].orderStatus + "</div>"
                + "<div class=\"ordertrailer\">"
                + "<div>" + removeunderscore(orders[i].vendorID) + "</div>"
                + "</div>"
                + "</a>"
                + "<a class=\"viewonMap hoverable\" href=\"/customer/van/" + orders[i].vendorID + "\">View On Map</a>"
                + "</div>"
    }
    ordersElement.innerHTML = output
    changeColor()
}

// execute on load
changeColor()
updateOrders(allOrders)

const socket = io()
if (customerID != null) {
    socket.emit('customerID', customerID);
    socket.on('ordersChange', function (orders) {
        updateOrders(orders)
    })
}