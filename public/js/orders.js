function pendingColour() {
    var targets = document.getElementsByClassName('orderstatus')
    for (var i = 0; i < targets.length; i++) {
        if (targets[i].innerHTML == "Ordering") { 
            targets[i].style.color = "#ff8800";
            targets[i].innerHTML = "Pending"
        } else if (targets[i].innerHTML == "Fulfilled") {
            targets[i].style.color = "#8fdb02"
            targets[i].innerHTML = "Ready for pickup"
        } else if (targets[i].innerHTML == "Picked Up") {
            targets[i].style.color = "#06db02"
            targets[i].innerHTML = "Complete"
        } else {
            targets[i].innerHTML = ""
        }
    }
}
pendingColour()