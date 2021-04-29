// filter menu by categories
function filterMenu(elmt) {
    console.log(elmt.id)
    itemsInCategoryList = document.getElementsByClassName(elmt.id);
    allItemsList = document.getElementsByClassName('menuitemcontainer');
    console.log('itemsInCategoryList')
    console.log(itemsInCategoryList)
    console.log('allItemsList')
    console.log(allItemsList)
    itemsInCategory = Array.from(itemsInCategoryList)
    allItems = Array.from(allItemsList);
    console.log('itemsInCategory')
    console.log(itemsInCategory)
    console.log('allItems')
    console.log(allItems)

    // go through each element of allItems
    // if the current element (item) cannot be found (indexOf returns -1) then keep the element (filter test is true)
    // if the current element (item) is found (indexOf returns the index i.e. not -1) then discard the element (filter test is false)
    itemsNotInCategory = allItems.filter(item => itemsInCategory.indexOf(item) === -1)
    console.log('itemsNotInCategory')
    console.log(itemsNotInCategory)
    if (elmt.checked) {
        for (var i = 0; i < itemsNotInCategory.length; i++) {
            itemsNotInCategory[i].style.display = 'none';
        }
    } else {
        for (var i = 0; i < itemsNotInCategory.length; i++) {
            itemsNotInCategory[i].style.display = 'inline-block';
        }
    }
}