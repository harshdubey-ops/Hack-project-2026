let x = document.querySelector("#temp1");
x.style.backgroundColor = "rgb(15, 131, 15)";
x.style.color = "white";
x.addEventListener("mouseenter",function(){
    x.style.backgroundColor = "rgb(89, 194, 29)";
    x.style.color = "black";
})
x.addEventListener("mouseleave",function(){
    x.style.backgroundColor = "rgb(15, 131, 15)";
    x.style.color = "white";
})

let y = document.querySelector("#temp2");
y.style.backgroundColor = "rgb(15, 131, 15)";
y.style.color = "white";
y.addEventListener("mouseenter",function(){
    y.style.backgroundColor = "rgb(89, 194, 29)";
    y.style.color = "black";
})
y.addEventListener("mouseleave",function(){
    y.style.backgroundColor = "rgb(15, 131, 15)";
    y.style.color = "white";
})