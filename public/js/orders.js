function pendingColour() {
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
pendingColour()