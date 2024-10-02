const cartSideBar = document.querySelector(".cart-sidebar");
const openCart = document.getElementById("cartIcon");
const closeCart = document.getElementById("closeCart");
const navBar = document.querySelector(".nav-link");
const openNav = document.getElementById("openNav");
const closeNav = document.getElementById("closeNav");
const shopBtn = document.querySelectorAll("#showBtn");
const productCards = document.querySelectorAll(".shop-product-card");
const loadMore = document.getElementById("loadBtn");





openNav.addEventListener("click", () =>{
    navBar.classList.add("open")
});

closeNav.addEventListener("click", () =>{
    navBar.classList.remove("open")
});

openCart.addEventListener("click", () => {
    cartSideBar.classList.add("open")
});

closeCart.addEventListener("click", () => {
    cartSideBar.classList.remove("open")
});

shopBtn.forEach((shopbuttons) =>{
    shopbuttons.addEventListener("click", () =>{
        window.open("https://expressecommerce.vercel.app/shop.html", "_blank")
    })
});


var defaultProductCard = 6
loadMore.addEventListener("click", () =>{
    for (let i = defaultProductCard; i < defaultProductCard + 6; i++) {
         if(productCards[i]){
            productCards[i].style.display = "block"
         }
    }
    defaultProductCard +=6;
    if(defaultProductCard >= productCards.length){
        event.target.style.display = "none"
    }
});


if (document.readyState == "loading") {
    document.addEventListener("DOMContentLoaded", ready)
} else {
    ready();
}

//
function ready() {
    var deletCartBtn = document.getElementsByClassName("deleteProduct");
    for (var i = 0; i < deletCartBtn.length; i++) {
        var delBtn = deletCartBtn[i];
        delBtn.addEventListener("click", removerCartItem)
    }

    // Quantity Change
    var quantityField = document.getElementsByClassName("cartQuantity");
    for (var i = 0; i < quantityField.length; i++) {
        var input = quantityField[i];
        input.addEventListener("change", quantityFieldChange);
    }

    // Add to cart
    var addToCart = document.getElementsByClassName("add-to-cart");
    for (var i = 0; i < addToCart.length; i++) {
        var button = addToCart[i];
        button.addEventListener("click", addToCartClicked)
    }
    loadRefreshCartItem()
}


// FUNCTION FOR ADDING TO CART
function addToCartClicked(e) {
    var button = e.target;
    var shopProduct = button.closest(".product-card");
    var productTitle = shopProduct.getElementsByClassName('product-title')[0].innerText;
    var productPrice = shopProduct.getElementsByClassName("price")[0].innerText;
    var productImage = shopProduct.getElementsByClassName("product-img")[0].src;

    addNewProductToCart(productTitle, productPrice, productImage);
    updateTotalPrice();
    saveAllProductToLocalStorage();
    updateQuantityCartIcon();
};



// CREATING A NEW ADD PRODUCT TO CART
function addNewProductToCart(productTitle, productPrice, productImage, quantity = 1) {
    var cartMainBox = document.createElement("div");
    cartMainBox.classList.add("cart-box");
    var cartItems = document.getElementsByClassName("cart-content")[0];
    var cartItemsName = cartItems.getElementsByClassName("cart-product-title");
    for (var i = 0; i < cartItemsName.length; i++) {
        if (cartItemsName[i].innerText == productTitle) {
            alert("product added successfully");
            return;
        }
    }
    var cartBoxContent = 
    `<img src="${productImage}" alt="product" id="cartImg" class="cart-img">
        <div class="cart-details">
            <div class="cart-product-title">${productTitle}</div>
            <div class="cart-price">${productPrice}</div>
            <input type="number" value="${quantity}" class="cartQuantity">
        </div>
        <i class="fa-solid fa-trash deleteProduct"></i>`
    cartMainBox.innerHTML = cartBoxContent;
    cartItems.append(cartMainBox);
    cartMainBox.getElementsByClassName("deleteProduct")[0].addEventListener("click", removerCartItem);
    cartMainBox.getElementsByClassName("cartQuantity")[0].addEventListener("change", quantityFieldChange);

    saveAllProductToLocalStorage();
    updateQuantityCartIcon();
}
 

// REMOVING CART ITEM
function removerCartItem(e) {
    var removeBtn = e.target;
    removeBtn.parentElement.remove();

    updateTotalPrice();
    saveAllProductToLocalStorage();
    updateQuantityCartIcon();
};

// FUNCTION FOR QUANTITY CHANGE
function quantityFieldChange(e) {
    var inputField = e.target;
    if (isNaN(inputField.value) || inputField.value <= 1) {
        inputField.value = 1;
    }
    updateTotalPrice();
    saveAllProductToLocalStorage();
    updateQuantityCartIcon();
};  


// FUNCTION FOR UPDATING TOTAL
function updateTotalPrice() {
    var cartContent = document.getElementsByClassName("cart-content")[0];
    var cartBox = cartContent.getElementsByClassName("cart-box");
    var totalPrice = 0;

    for (var i = 0; i < cartBox.length; i++) {
        var box = cartBox[i];
        // getting the index of the price
        var priceText = box.getElementsByClassName("cart-price")[0];
        // getting the index of the quantity input
        var quantityText = box.getElementsByClassName("cartQuantity")[0];
        // converting the price to float and replacing it
        var price = parseFloat(priceText.innerText.replace("$", ""));
        var quantity = quantityText.value;
        totalPrice += price * quantity;
    };

    // if a price should have a decimal number
    totalPrice = Math.round(totalPrice * 100) / 100;

    document.getElementsByClassName("total-price")[0].innerText = "$" + totalPrice;
    
    localStorage.setItem("savedTotal", totalPrice);
};


// FUNCTION FOR LOCAL STORAGE
function saveAllProductToLocalStorage(){
    var saveCartContent = document.getElementsByClassName("cart-content")[0];
    var saveCartBox = saveCartContent.getElementsByClassName("cart-box");
    var savedCartProduct = []
    
    for (let i = 0; i < saveCartBox.length; i++) {
        const saveCartBoxes = saveCartBox[i];

        var titleElement = saveCartBoxes.getElementsByClassName('cart-product-title')[0];
        var priceElement = saveCartBoxes.getElementsByClassName('cart-price')[0];
        var quantityElement = saveCartBoxes.getElementsByClassName('cartQuantity')[0];
        var productImgElement = saveCartBoxes.getElementsByClassName('cart-img')[0].src;

        var items = {
            title : titleElement.textContent,
            price : priceElement.textContent,
            quantity : quantityElement.value,
            productimage : productImgElement
        }
        savedCartProduct.push(items);
    }
    localStorage.setItem("savedCartProduct", JSON.stringify(savedCartProduct))
};


// Loads in cart
function loadRefreshCartItem(){
    var loadCartItems = localStorage.getItem("savedCartProduct");
    if(loadCartItems){
        loadCartItems = JSON.parse(loadCartItems);

        for (let i = 0; i < loadCartItems.length; i++) {
            var loadItems = loadCartItems[i];
            addNewProductToCart(loadItems.title, loadItems.price, loadItems.productimage)
            
            var loadCartBoxes = document.getElementsByClassName("cart-box");
            var loadCartBox = loadCartBoxes[loadCartBoxes.length - 1];
            var loadQuantity = loadCartBox.getElementsByClassName("cartQuantity")[0];
            loadQuantity.value = loadItems.quantity; 
        }
    }
    var cartTotal = localStorage.getItem("savedTotal");
    if(cartTotal){
        document.getElementsByClassName("total-price")[0].innerText = "$" + cartTotal
    }
    updateQuantityCartIcon();
}


// UPDATING THE QUANTITY IN THE CART ICON
function updateQuantityCartIcon(){
    var quantityCartBoxes = document.getElementsByClassName("cart-box");
    var quantityIcon = 0;

    for (let i = 0; i < quantityCartBoxes.length; i++) {
        const quantityCartBox = quantityCartBoxes[i];
        const quantityIconElem = quantityCartBox.getElementsByClassName("cartQuantity")[0];
        quantityIcon+= parseInt(quantityIconElem.value);
    }
    var quantityCartIcon = document.querySelector("#cartIcon");
     quantityCartIcon.setAttribute("data-quantity", quantityIcon)
};

// CLEAR CART AFTER PAYMENT
function clearCartAfterPayment(){
    const clearCartContent = document.getElementsByClassName("cart-content")[0];
    clearCartContent.innerHTML = "";
    updateTotalPrice();
    localStorage.removeItem("savedCartProduct");
}