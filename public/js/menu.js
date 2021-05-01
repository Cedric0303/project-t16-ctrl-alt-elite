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

// shopping cart api--------------------------
var shoppingCart = (function () {
    // ---------------------
    // private methods
    // ---------------------
    // init empty cart
    cart = [];
    
    // item object constructor
    function Item(name, price, count) {
        this.name = name;
        this.price = price;
        this.count = count;
    }

    // save cart in local storage
    function saveCart() {
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
    }
    // load cart into 'cart' array
    function loadCart() {
        cart = JSON.parse(localStorage.getItem('shoppingCart'));
    }
    // if cart in localstorage is not empty, load the cart automatically
    if (sessionStorage.getItem('shoppingCart') != null) {
        loadCart();
    }

    // ---------------------
    // public methods
    // ---------------------
    var obj = {};

    // add to cart
    obj.addItemToCart = function(name, price, count) {
        // if item exists in cart, increment by 1
        for(var item in cart) {
            if(cart[item].name === name) {
            cart[item].count ++;
            saveCart();
            return;
            }
        }
        var item = new Item(name, price, count);
        cart.push(item);
        saveCart();
    }

    // update count for item
    obj.setCountForItem = function(name, count) {
        for(var i in cart) {
            if (cart[i].name === name) {
                cart[i].count = count;
                break;
            }
        }
        saveCart();
    }

    // remove item from cart
    obj.removeItemFromCart = function(name) {
        // if item exists in cart, decrement by 1
        for(var item in cart) {
            if(cart[item].name === name) {
                cart[item].count --;
                if(cart[item].count === 0) {
                    cart.splice(item, 1);
                }
            }
        }
        saveCart();
    }

    // remove all items from cart
    obj.removeItemFromCartAll = function(name) {
        for(var item in cart) {
            if(cart[item].name === name) {
                cart.splice(item, 1);
                break;
            }
        }
        saveCart();
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
        return Number(totalCart.toFixed(2));
    }

    // get cart, returns a copy of the current cart
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
})

// expand/collapse cart
function toggleCart() {
    cartcontainer = document.getElementById('cartcontainer');
    // if cart is expanded
    if (cartcontainer.style.height == '30vh') {
        // collapse cart
        cartcontainer.style.height = 'initial';
        // hide cart contents
        document.getElementById('cart').style.display = 'none';
        // change view cart button to 'view cart' 
        document.getElementById('vcartbutton').innerHTML = 'Cart&nbsp;(<span class="cart-count"></span>)';
    } else {
        // expand cart
        cartcontainer.style.height = '30vh';
        // show cart contents
        document.getElementById('cart').style.display = 'grid';
        // change view cart button to 'close cart'
        document.getElementById('vcartbutton').innerHTML = 'Hide Cart';
    }
}

// ---------register events to elements----------
// menu category filter buttons
categoryCheckboxes = document.getElementsByName('catcheck');
for (var i=0; i < categoryCheckboxes.length; i++) {
    categoryCheckboxes[i].addEventListener("click", filterMenu, false);
}

// view cart button
document.getElementById('vcartbutton').addEventListener("click", toggleCart, false)

// run the filter on load
filterMenu()