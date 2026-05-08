let x = document.querySelector("#temp1");
x.style.backgroundColor = "rgb(45, 142, 0)";
x.style.color = "white";
x.addEventListener("mouseenter",function(){
    x.style.backgroundColor = "rgb(72, 163, 20)";
    x.style.color = "black";
})
x.addEventListener("mouseleave",function(){
    x.style.backgroundColor = "rgb(42, 142, 0)";
    x.style.color = "white";
})

let y = document.querySelector("#temp2");
y.style.backgroundColor = "rgb(15, 142, 0)";
y.style.color = "white";
y.addEventListener("mouseenter",function(){
    y.style.backgroundColor = "rgb(72, 163, 20)";
    y.style.color = "black";
})
y.addEventListener("mouseleave",function(){
    y.style.backgroundColor = "rgb(15, 142, 0)";
    y.style.color = "white";
})
function addToCart() {
  alert("Product Added To Cart")
}

// hindi and english language toggle functions

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
      "Buy fresh products directly from farmers.";

      document.getElementById("searchBox").placeholder =
      "Search Products";

      document.getElementById("searchBtn").innerHTML =
      "Search";

      document.getElementById("productName").innerHTML =
      "Fresh Tomatoes";

      document.getElementById("price").innerHTML =
      "₹40/kg";

      document.getElementById("cartBtn").innerHTML =
      "Add To Cart";
    }

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
      "किसानों से सीधे ताज़े उत्पाद खरीदें।";

      document.getElementById("searchBox").placeholder =
      "उत्पाद खोजें";

      document.getElementById("searchBtn").innerHTML =
      "खोजें";

      document.getElementById("productName").innerHTML =
      "ताज़े टमाटर";

      document.getElementById("price").innerHTML =
      "₹40/किलो";

      document.getElementById("cartBtn").innerHTML =
      "कार्ट में जोड़ें";
    }

    function addToCart(){
      alert("Product Added To Cart!");
    }