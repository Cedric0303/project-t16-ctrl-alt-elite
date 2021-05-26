// filter menu by categories
function filterMenu() {
    var searchTerm = document.getElementById("searchbar").value;
    var regex = new RegExp(`^${searchTerm}`, 'i');

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

    // hide items which do not match the search term
    for(var i = 0; i < allItems.length; i++){
        // compare search term with each word in item name
        var words = allItems[i].id.split(" ")
        var matchFound = false;
        for(var j = 0; j < words.length; j++){
            if((regex).test(words[j])){
                matchFound = true;
                break;
            }
        }
        // hide item if no word is a match
        if(!matchFound){
            allItems[i].style.display = 'none';
        }
    }
    
}

// reference original order items in origOrder
origOrder = order["item"];


// shopping cart api--------------------------
// based off of "Shopping cart JS" by Burlaka Dmytro (https://codepen.io/Dimasion/pen/oBoqBM)
var shoppingCart = (function () {
    // ---------------------
    // private methods
    // ---------------------
    // init empty cart
    var cart = [];
    
    // item object constructor
    function Item(id, name, price, count) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.count = count;
    };

    // load cart with order items
    // the following make a true clone, not a reference to origOrder
    cart = JSON.parse(JSON.stringify(origOrder))

    // ---------------------
    // public methods
    // ---------------------
    var obj = {};

    // add to cart
    obj.addItemToCart = function(id, name, price, count) {
        // if item exists in cart, increment by 1
        for(var item in cart) {
            if(cart[item].id === id) {
                cart[item].count++;
                return;
            }
        }
        // if not, add the item to cart with respective price/count
        var item = new Item(id, name, price, count);
        cart.push(item);
    }

    // update count for item
    obj.setCountForItem = function(id, name, count, price) {
        for(var item in cart) {
            // if item in cart, update count
            if (cart[item].id === id) {
                cart[item].count = count;
                // if item count is 0, remove item
                if(cart[item].count == 0) {
                    cart.splice(item, 1);
                }
                return;
            }
        }
        // if new item, add with count 
        var item = new Item(id, name, price, count);
        cart.push(item);
    }

    // remove item from cart
    obj.removeItemFromCart = function(id) {
        // if item exists in cart, decrement by 1
        for(var item in cart) {
            if(cart[item].id === id) {
                cart[item].count --;
                // if item count is 0, remove item
                if(cart[item].count === 0) {
                    cart.splice(item, 1);
                }
            }
        }
    }

    // remove all of an item from cart
    obj.removeItemFromCartAll = function(id) {
        for(var item in cart) {
            if(cart[item].id == id) {
                cart.splice(item, 1);
                break;
            }
        }
    }

    // return total quantity of items in cart
    obj.totalCount = function() {
        var totalCount = 0;
        for(var item in cart) {
            totalCount += cart[item].count;
        }
        return totalCount;
    }

    // return total cost of items in cart
    obj.totalCart = function() {
        var totalCart = 0;
        for(var item in cart) {
            totalCart += cart[item].price * cart[item].count;
        }
        return Number(totalCart).toFixed(2);
    }

    // get cart, returns a copy of the current cart as array
    obj.getCart = function() {
        var cartCopy = [];
        for(i in cart) {
            item = cart[i];
            itemCopy = {};
            for(property in item) {
                itemCopy[property] = item[property];
            }
            itemCopy.total = Number(item.price * item.count).toFixed(2);
            cartCopy.push(itemCopy);
        }
        return cartCopy;
    }

    // empties cart, can be accessed in console via shoppingCart.clearCart()
    obj.clearCart = function() {
        cart = [];
    }

    return obj;
})();

// expand/collapse cart
function toggleCart() {
    cartcontainer = document.getElementById('editcartcontainer');
    // if cart is expanded
    if (cartcontainer.style.height == '30vh') {
        // collapse cart
        cartcontainer.style.height = 'initial';
        // hide cart contents
        document.getElementById('cart').style.display = 'none';
        displayCart();
    } else {
        // expand cart
        cartcontainer.style.height = '30vh';
        // show cart contents
        document.getElementById('cart').style.display = 'grid';
        // change view cart button to 'close cart'
        displayCart();
    }
}

// ---------register events to elements----------
// menu category filter buttons
categoryCheckboxes = document.getElementsByName('catcheck');
for (var i=0; i < categoryCheckboxes.length; i++) {
    categoryCheckboxes[i].addEventListener("click", filterMenu, false);
}

// view cart button
document.getElementById('cartexpand').addEventListener("click", toggleCart, false)

// write in search bar
document.getElementById('searchbar').addEventListener("input", filterMenu, false)


// cart api events
// ----------------------
function displayCart() {
    var cartArray = shoppingCart.getCart();
    var output = "";
    for (var item in cartArray) {
        output += "<div class=\"cartitem\" id=\"cart"+cartArray[item].id+"\">"
                + "<div class=\"delete-item-cart itemdel\"><i class=\"fas fa-times\"></i></div>"
                + "<div class=\"itemname\">"+cartArray[item].name.replace("_", " ")+"</div>"
                + "<div class=\"itemquant number-input\">"
                    +"<button class=\"minus-item\" onclick=\"this.parentNode.querySelector('input[type=number]').stepDown();\"><i class=\"fas fa-minus-circle\"></i></button>"
                    +"<input class=\"itemcount\" name=\""+cartArray[item].name+"\" type=\"number\" value="+cartArray[item].count+" min=\"0\" max=\"99\">"
                    +"<button class=\"plus-item\" data-id="+cartArray[item].id+" onclick=\"this.parentNode.querySelector('input[type=number]').stepUp();\"><i class=\"fas fa-plus-circle\"></i></button>"
                + "</div>"
                + "<div class=\"itemprice\">$"+cartArray[item].total+"</div>"
                + "</div>";
    }
    
    // update menu counts as well
    var itemcounts = document.getElementsByClassName('itemcount');
    for (var field in itemcounts) {
        // for every field in the menu, check if the field is in the cart
        var changed = false;
        for (var item in cartArray) {
            // if field is in cart, update the field value with the cart
            if (itemcounts[field].name == cartArray[item].name) {
                itemcounts[field].value = cartArray[item].count;
                changed = true;
            }
        }
        // if the field is not in the cart then set to 0
        if (!changed) {
            itemcounts[field].value = 0;
        }
    }
     
    // update text on screen
    document.getElementById('cartlist').innerHTML = output;
    document.getElementById('carttotaltext').innerHTML = shoppingCart.totalCart();

    // check if there have been changes to the order
    // and update cart colors accordingly
    for (var itemCurr in cartArray) {
        for (var itemOrig in origOrder) {
            cartitemid = 'cart'+cartArray[itemCurr].id
            cartitemelement = document.getElementById(cartitemid)
            // if an item exists in the original order
            if (origOrder[itemOrig].id == cartArray[itemCurr].id) {
                // check if the count changed
                if (origOrder[itemOrig].count < cartArray[itemCurr].count) {
                    // item increased in count
                    cartitemelement.querySelector('.itemname').style.color = "#5fd300";
                    cartitemelement.querySelector('input[type=number]').style.color = "#5fd300";
                    break;
                } else if (origOrder[itemOrig].count > cartArray[itemCurr].count) {
                    // item reduced in count
                    cartitemelement.querySelector('.itemname').style.color = "#ef5658";
                    cartitemelement.querySelector('input[type=number]').style.color = "#ef5658";
                    break;
                }
                else {
                    // item count remained the same
                    cartitemelement.querySelector('.itemname').style.color = "#000000";
                    cartitemelement.querySelector('input[type=number]').style.color = "#000000";
                    break;
                }
            } else {
                // if new item then
                cartitemelement.querySelector('.itemname').style.color = "#5fd300";
                cartitemelement.querySelector('input[type=number]').style.color = "#5fd300";
            }
        }
    }


    // register functions
    // add to cart (+) on menu, increment/add
    var itemplusbuttons = document.getElementsByClassName('plus-item');
    for (var i=0; i<itemplusbuttons.length; i++) {
        itemplusbuttons[i].addEventListener("click", registerAddItem);
    };

    // remove from cart (-) on menu, decrement/remove
    var itemminusbuttons = document.getElementsByClassName('minus-item');
    for (var i=0; i<itemminusbuttons.length; i++) {
        itemminusbuttons[i].addEventListener("click", registerRemItem);
    };

    // delete item button on cart
    var cartitemdelbuttons = document.getElementsByClassName('delete-item-cart');
    for (var i=0; i<cartitemdelbuttons.length; i++) {
        cartitemdelbuttons[i].addEventListener("click", registerRemItemAll);
    };

    // update count of item
    for (var i=0; i<itemcounts.length; i++) {
        itemcounts[i].addEventListener("change", registerItemCount);
    };
}

function registerAddItem(event) {
    event.preventDefault();
    var id = this.dataset.id;
    var name = this.parentNode.querySelector('input[type=number]').name;
    var price = Number(this.dataset.price);
    shoppingCart.addItemToCart(id, name, price, 1);
    displayCart();
}

function registerRemItem(event) {
    event.preventDefault();
    var id = this.parentNode.querySelector('button.plus-item').dataset.id;
    shoppingCart.removeItemFromCart(id);
    displayCart();
}

function registerRemItemAll(event) {
    event.preventDefault();
    var id = this.parentNode.querySelector('button.plus-item').dataset.id;
    shoppingCart.removeItemFromCartAll(id);
    displayCart();
}

function registerItemCount(event) {
    event.preventDefault();
    var id = this.parentNode.querySelector('button.plus-item').dataset.id;
    var name = this.name;
    var count = Number(this.value);
    var price = this.parentNode.querySelector('button.plus-item').dataset.price;
    if (count == 0) {
        shoppingCart.setCountForItem(id, name, count);
    } else {
        shoppingCart.setCountForItem(id, name, count, price);
    }
    displayCart();
}

// run on load
filterMenu();
toggleCart();

function postOrder() {
    cart = shoppingCart.getCart();
    if (cart.length == 0) {
        alert("Your cart is empty!");
        return;
    }
    var payload = {
        item: cart,
        vendorID: vaninfo.loginID
    };
    payload = JSON.stringify(payload);
    console.log(payload);
    document.getElementById('payloadInput').value = payload;
    document.getElementById('orderForm').submit(); 
}

// register checkout button
document.getElementById('updatebutton').addEventListener("click",postOrder);
// shoppingCart.getCart() - returns array of cart
// vaninfo - returns a json object with selected van info

// register openModal to all menu items
var menuitems = document.getElementsByClassName('menuitemclick');
for (var i=0; i<menuitems.length; i++) {
    menuitems[i].addEventListener("click", openModal);
}; 
// register close action for X button and modal space
document.getElementById('modalclose').addEventListener("click", function() {
    modal.style.display = "none";
});
document.getElementById('modal').addEventListener("click", function() {
    modal.style.display = "none";
});

// image modal code
function openModal() {
    imgToZoom = this.firstElementChild;
    var modal = document.getElementById("modal");
    var modalImg = document.getElementById("modal-content");
    var caption = document.getElementById("caption");
    modal.style.display = "block";
    modalImg.src = imgToZoom.src;
    caption.innerHTML = imgToZoom.alt;
    return false;
}