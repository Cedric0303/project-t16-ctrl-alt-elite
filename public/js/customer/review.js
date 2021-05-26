submitButton = document.getElementById('submitReview')
reviewBox = document.getElementById('reviewBox')
stars = [...document.getElementsByName('rating')]

function checkContent() {
    // check if star rating was given
    starchecked = false;
    for (var star in stars) {
        if (stars[star].checked == true) {
            starchecked = true;
        }
    }
    
    reviewexist = false;
    // check if text review was given
    if (reviewBox.value == '') {
        reviewexist = false;
    } else {
        reviewexist = true;
    }

    // if star rating was given, enable review submit
    if (starchecked | reviewexist) {
        submitButton.disabled = false;
    } else {
        submitButton.disabled = true;
    }
}