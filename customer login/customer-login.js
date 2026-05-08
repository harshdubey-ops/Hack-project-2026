// customer-login.js

function loginCustomer() {
  alert("Login Successful");
}

function signupCustomer() {
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
      "कस्टमर लॉगिन";

    document.getElementById("signupTitle").innerText =
      "कस्टमर साइनअप";

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

    document.getElementById("newCustomerText").innerHTML =
      'नए कस्टमर? <a href="#" onclick="showSignup()">अकाउंट बनाएं</a>';

    document.getElementById("alreadyAccountText").innerHTML =
      'पहले से अकाउंट है? <a href="#" onclick="hideSignup()">लॉगिन</a>';
  }

  else {

    location.reload();
  }
}