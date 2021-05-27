selectedOrderIndex = 0;
function selectOrder() {
    for (var i=0; i<orders.length; i++) {
        if (orders[i] == this) {
            selectedOrderIndex = i;
            
            break;
        }
    }
    console.log(selectedOrderIndex);
}

orders = document.getElementsByClassName('order')
function registerFunctions() {
    // register order selection function
    for (var i=0; i<orders.length; i++) {
        orders[i].addEventListener("click", selectOrder)
    }
}

registerFunctions();

// ---------------live update code--------------
const socket = io()
socket.emit('vanID', van.loginID);
socket.on('orderChange', function (orders) {
    output = ""
    for (i in orders) {
        output += "<div class=\"order hoverable\">"
                + "<div>" + orders[i].orderID + "</div>"
                + "<div>" + orders[i].orderStatus + "</div>"
                + "<div>" + orders[i].customerGivenName + "</div>"
        for (j in orders[i].item) {
            item = orders[i].item[j]
            output += "<div class=\"orderitem\">"
                    + "<div>" + orders[i].item[j].count + "x</div>"
                    + "<div>" + orders[i].item[j].name + "</div>"
                    + "<div>$" + (orders[i].item[j].total).toFixed(2) + "</div>"
                    + "</div>"
        }
        output += "</div>"
    }
    document.getElementById("currentOrders").innerHTML = output
    registerFunctions();
})