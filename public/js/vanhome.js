function htmlifyVan(name, address, dist, loginId, index) {
    html = "<div id=\"vanlist"+index+"\" class=\"vanlistitem\"><div class=\"vaninfo\"><h3><span class=\"vanname\">"+name+"</span></h3><h4><span class=\"vanaddress\">"+address+"</span></h4><h5><i class=\"fas fa-map-marker-alt\"></i>&nbsp;&nbsp;<span class=\"vandist\">"+Math.round(dist)+"</span> m&nbsp;away</h5></div><div class=\"vancontinue\"><a href=\"/customer/"+loginId+"/menu/?dist="+Math.round(dist)+"\">Continue</a></div></div>";
    return html;
}

function moveToFront(array, index) {
    if (index > 0) {
        array.splice(index, 1);
        array.unshift(index);
    }
}

// array of 5 vans htmlified in order from nearest to furthest
vanListHtml = [];
for (var i=0; i<5; i++) {
    vanListHtml.push(htmlifyVan(vanDist[i][0].vanName, vanDist[i][0].address, vanDist[i][1], vanDist[i][0].loginID, i));
}

ordered = [0,1,2,3,4];
// the currently selected van as index of vanListHtml, vanDist
selectedVanIndex = 0;

function displayVanList(order) {
    // 'order' is an array of length 5, containing the index of a htmlified van in vanListHtml
    // e.g. order = [0,1,2,3,4]
    // displayVanList updates the innerHTML of vanlisttopcontent and vanlistbottomcontent
    internalcounter = 0;
    vanlistbottomcontent = ""
    for (index in order) {
        if (internalcounter == 0) {
            document.getElementById('vanlisttopcontent').innerHTML = vanListHtml[index];
        } else {
            vanlistbottomcontent += vanListHtml[index];
        }
        internalcounter += 1;
    }
    document.getElementById('vanlistbottomcontent').innerHTML = vanlistbottomcontent;

    // register each van list item with selectVan
    vans = document.getElementsByClassName('vanlistitem');
    for (var i=0;i<vans.length;i++) {
        vans[i].addEventListener("click",selectVan);
    }
}

// update collapsed van list to show selected van
function updateCollapsed() {
    // change "closest van" text to "selected van" if selected van isn't the closest
    if (selectedVanIndex == 0) {
        document.getElementById('vanlisttop').querySelector('h1').innerHTML = "Closest Van";
    } else {
        document.getElementById('vanlisttop').querySelector('h1').innerHTML = "Selected Van";
    }
    document.getElementById('vanlisttopcontent').innerHTML = vanListHtml[selectedVanIndex];
}

// expand/collapse van list
function toggleVanList() {
    vanlistbottom = document.getElementById('vanlistbottom');
    // if list is expanded
    if (vanlistbottom.style.display == 'flex') {
        // collapse list
        vanlistbottom.style.display = 'none';
        updateBorder(null);
        updateCollapsed();
    } else {
        // expand cart
        vanlistbottom.style.display = 'flex';
        document.getElementById('vanlisttop').querySelector('h1').innerHTML = "Closest Van";
        // display vans from nearest to furthest
        displayVanList(ordered);
        updateBorder(selectedVanIndex);
    }
}

function updateBorder(index) {
    // 'index' is index of van in list that is being selected 
    if (index == null) {
        for (var i=0;i<vans.length;i++) {
            vans[i].style.border = "none";
        }
        return;
    }
    vans = document.getElementsByClassName('vanlistitem');
    for (var i=0;i<vans.length;i++) {
        if (i != index) {
            // remove border from all other vans
            vans[i].style.border = "none";
        } else {
            // draw border around clicked van only if vanlist is expanded
            if (document.getElementById('vanlistbottom').style.display == 'flex') {
                vans[i].style.border = "1px solid #5490f5";
            }
        }
    }
}

function selectVan() {
    vans = document.getElementsByClassName('vanlistitem');
    for (var i=0;i<vans.length;i++) {
        // select clicked van
        if (vans[i] == this) {
            selectedVanIndex = i;
            displayVanList(ordered);
            updateMarkers()
            updateBorder(i);
        }
    }
}

// display vans in order of nearest to furthest
displayVanList(ordered);

// update selected marker function
function updateSelection() {
    vanMarkers.forEach((marker, index) => {
        if (marker[1].getElement() == this) {
            // for the selected marker
            selectedVanIndex = index;
            updateBorder(index);
            if (document.getElementById('vanlistbottom').style.display != 'flex') {
                updateCollapsed();
            }
        }
    })
}

// update marker display
function updateMarkers() {
    vanMarkers.forEach((marker, index) => {
        if (index != selectedVanIndex) {
            // for all markers that aren't the selected one
            marker[1].getElement().classList.remove('selectedMarker');
            marker[1].getElement().classList.add('marker');
        } else {
            // for the selected marker
            vanMarkers[selectedVanIndex][1].getElement().classList.remove('marker');
            vanMarkers[selectedVanIndex][1].getElement().classList.add('selectedMarker');
        }
    })
}


// -----------register events---------
// register van list expand/collapse button on top of van float
document.getElementById('vanlistexpand').addEventListener("click", toggleVanList);

// assign click event listeners to van markers to allow user to change selected van
vanMarkers.forEach((marker, index) => {
    marker[1].getElement().addEventListener('click', updateSelection);
    marker[1].getElement().addEventListener('click', updateMarkers);
})