// filter menu by categories
function filterMenu() {
    // check which categories are selected
    const itemsInCategory = [];
    categoryCheckboxes = document.getElementsByName('catcheck');
    for (var i=0; i < categoryCheckboxes.length; i++) {
        // if the current category is checked append all menu items of that category to the list: itemsInCategory
        items = document.getElementsByClassName(categoryCheckboxes[i].id)
        items = Array.from(items)
        if (categoryCheckboxes[i].checked) {
            itemsInCategory.push(...items);
        }
    }

    allItemsList = document.getElementsByClassName('menuitemcontainer'); // get list of all menu items
    allItems = Array.from(allItemsList);

    // get a list of all menu items that are NOT selected 
    // go through each element of allItems
    // if the current element (item) cannot be found (indexOf returns -1) then keep the element (filter test is true)
    // if the current element (item) is found (indexOf returns the index i.e. not -1) then discard the element (filter test is false)
    itemsNotInCategory = allItems.filter(item => itemsInCategory.indexOf(item) === -1)

    // if nothing is selected, show all the menu items
    if (itemsInCategory.length == 0) {
        for (var i = 0; i < allItems.length; i++) {
            allItems[i].style.display = 'inline-block';
        }
    } else {
        // show all the menu items
        for (var i = 0; i < allItems.length; i++) {
            allItems[i].style.display = 'inline-block';
        }
        // hide all the items that are NOT selected
        for (var i = 0; i < itemsNotInCategory.length; i++) {
            itemsNotInCategory[i].style.display = 'none';
        }
    }
}

// register events to elements
categoryCheckboxes = document.getElementsByName('catcheck');
for (var i=0; i < categoryCheckboxes.length; i++) {
    categoryCheckboxes[i].addEventListener("click", filterMenu, false);
}

// run the filter on load
filterMenu()