function htmlifyVan(name, address, dist, loginId) {
    html = "<div class=\"vanlistitem\"><div class=\"vaninfo\"><h3><span class=\"vanname\">"+name+"</span></h3><h4><span class=\"vanaddress\">"+address+"</span></h4><h5><i class=\"fas fa-map-marker-alt\"></i>&nbsp;&nbsp;<span class=\"vandist\">"+Math.round(dist)+"</span> m&nbsp;away</h5></div><div class=\"vancontinue\"><a href=\"/customer/"+loginId+"/menu/?dist="+Math.round(dist)+"\">Continue</a></div></div>";
    return html;
}

// array of 5 vans htmlified in order from nearest to furthest
vanListHtml = [];
for (var i=0; i<5; i++) {
    vanListHtml.push(htmlifyVan(vanDist[i][0].vanName, vanDist[i][0].address, vanDist[i][1], vanDist[i][0].loginID));
}

vanlistbottomcontent = ""
// only get 5 nearest vans
for (var i=0; i<5; i++) {
    // nearest van selected on page load
    if (i==0) {
        document.getElementById('vanlisttopcontent').innerHTML = vanListHtml[i];
    } else {
        // fill vanlistbottom with vans ordered by nearest to furthest
        vanlistbottomcontent += vanListHtml[i];
    }
}
document.getElementById('vanlistbottomcontent').innerHTML = vanlistbottomcontent;

// expand/collapse van list
function toggleVanList() {
    vanlistbottom = document.getElementById('vanlistbottom');
    // if list is expanded
    if (vanlistbottom.style.display == 'flex') {
        // collapse list
        vanlistbottom.style.display = 'none';
    } else {
        // expand cart
        vanlistbottom.style.display = 'flex';
    }
}

// function selectVan

// register events
// register van list expand/collapse to small bar on top of van float
document.getElementById('vanlistexpand').addEventListener("click", toggleVanList);