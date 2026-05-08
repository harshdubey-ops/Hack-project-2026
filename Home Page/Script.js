function addToCart(){

  alert("Product Added To Cart!");

}

/* English Language */

function setEnglish(){

  document.getElementById("title").innerHTML =
  "🌾 Fasal Junction";

  document.getElementById("farmerBtn").innerHTML =
  "Farmer Login";

  document.getElementById("customerBtn").innerHTML =
  "Customer Login";

  document.getElementById("heroTitle").innerHTML =
  "Fresh From Farm To Home";

  document.getElementById("heroText").innerHTML =
  "Buy fresh vegetables directly from farmers.";

  document.getElementById("searchBox").placeholder =
  "Search Products";

  document.getElementById("searchBtn").innerHTML =
  "Search";

  let products =
  document.querySelectorAll(".product-name");

  products.forEach((item)=>{
    item.innerHTML = item.dataset.en;
  });

  let buttons =
  document.querySelectorAll(".cart-btn");

  buttons.forEach((btn)=>{
    btn.innerHTML = btn.dataset.en;
  });

}

/* Hindi Language */

function setHindi(){

  document.getElementById("title").innerHTML =
  "🌾 फसल जंक्शन";

  document.getElementById("farmerBtn").innerHTML =
  "किसान लॉगिन";

  document.getElementById("customerBtn").innerHTML =
  "ग्राहक लॉगिन";

  document.getElementById("heroTitle").innerHTML =
  "खेत से सीधे आपके घर तक";

  document.getElementById("heroText").innerHTML =
  "किसानों से सीधे ताज़ी सब्जियां खरीदें।";

  document.getElementById("searchBox").placeholder =
  "उत्पाद खोजें";

  document.getElementById("searchBtn").innerHTML =
  "खोजें";

  let products =
  document.querySelectorAll(".product-name");

  products.forEach((item)=>{
    item.innerHTML = item.dataset.hi;
  });

  let buttons =
  document.querySelectorAll(".cart-btn");

  buttons.forEach((btn)=>{
    btn.innerHTML = btn.dataset.hi;
  });

}