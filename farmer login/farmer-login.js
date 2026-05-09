// farmer-login.js

function loginFarmer() {
  alert("Login Successful");
}

function signupFarmer() {
  if(document.getElementById("signupPassword").value !== document.getElementById("reEnterPassword").value) {
    alert("Passwords do not match");
    return;
  }
  alert("Signup Successful");
}

/* Animated Switch */

function showSignup() {

  document.getElementById("loginBox")
    .classList.add("hidden");

  document.getElementById("signupBox")
    .classList.remove("hidden");
}

function hideSignup() {

  document.getElementById("signupBox")
    .classList.add("hidden");

  document.getElementById("loginBox")
    .classList.remove("hidden");
}

/* Language Toggle */

function setLanguage(lang) {

  if (lang === "hi") {

    document.getElementById("loginTitle").innerText =
      "किसान लॉगिन";

    document.getElementById("signupTitle").innerText =
      "किसान साइनअप";

    document.getElementById("email").placeholder =
      "ईमेल";

    document.getElementById("password").placeholder =
      "पासवर्ड";

    document.getElementById("name").placeholder =
      "पूरा नाम";

    document.getElementById("signupEmail").placeholder =
      "ईमेल";

    document.getElementById("phone").placeholder =
      "मोबाइल नंबर";

    document.getElementById("signupPassword").placeholder =
      "पासवर्ड बनाएं";

    document.getElementById("loginBtn").innerText =
      "लॉगिन";

    document.getElementById("signupBtn").innerText =
      "साइनअप";

    document.getElementById("newFarmerText").innerHTML =
      'नए किसान? <a href="#" onclick="showSignup()">अकाउंट बनाएं</a>';

    document.getElementById("alreadyAccountText").innerHTML =
      'पहले से अकाउंट है? <a href="#" onclick="hideSignup()">लॉगिन</a>';
  }

  else {

    location.reload();
  }
}