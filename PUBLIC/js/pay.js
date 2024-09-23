const payBtn =document.querySelector(".cart-action-btn");

payBtn.addEventListener("click", ()=>{
    fetch('/checkout', {
        method : 'POST',
        headers : {"Content-Type": "application/json"},
        body : JSON.stringify({
            items : JSON.parse(localStorage.getItem("savedCartProduct"))
        }),
    })
    .then((res) => res.json())
    .then((url) =>{
        location.href = url;
        clearCartAfterPayment();
    })
    .catch((err) => console.log(err))
});