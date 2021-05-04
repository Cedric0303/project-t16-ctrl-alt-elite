function pendingcolour() {
    var target = document.getElementsByClassName('orderstatus')
    console.log(target)
    for (var i = 0; i < target.length; i++) {
        console.log (target[i].innerHTML)
        if (target[i].innerHTML == "Pending") { 
            target[i].style.color = orange;
        } 
    }
}

pendingcolour()


