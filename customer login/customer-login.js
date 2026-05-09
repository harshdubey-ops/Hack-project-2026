/* **************************** customer-login.js **************************** */

/* Login Page */

function loginCustomer() {
  alert("Customer Login Successful");
}

/* Generate OTP */

function generateOTP() {

  let otp = Math.floor(100000 + Math.random() * 900000);

  alert("Your OTP is: " + otp);

  localStorage.setItem("generatedOTP", otp);
}

/* Verify Email */

function verifyEmail() {

  let email = document.getElementById("signupEmail").value;

  if (email === "") {

    alert("Please enter email first");
  }

  else {

    alert("Email Verified Successfully");
  }
}

/* Signup Page */

function signupCustomer() {

  let enteredOTP =
    document.getElementById("otp").value;

  let savedOTP =
    localStorage.getItem("generatedOTP");

  let password =
    document.getElementById("signupPassword").value;

  let confirmPassword =
    document.getElementById("reEnterPassword").value;

  if (enteredOTP !== savedOTP) {

    alert("Invalid OTP");
    return;
  }

  else if (password !== confirmPassword) {

    alert("Passwords do not match");
    return;
  }

  else {

    alert("Customer Signup Successful");
  }
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

    /* Titles */

    document.getElementById("loginTitle").innerText =
      "ग्राहक लॉगिन";

    document.getElementById("signupTitle").innerText =
      "ग्राहक साइनअप";

    /* Login Placeholders */

    document.getElementById("email").placeholder =
      "ईमेल";

    document.getElementById("password").placeholder =
      "पासवर्ड";

    /* Signup Placeholders */

    document.getElementById("name").placeholder =
      "पूरा नाम";

    document.getElementById("signupEmail").placeholder =
      "ईमेल";

    document.getElementById("phone").placeholder =
      "मोबाइल नंबर";

    document.getElementById("otp").placeholder =
      "OTP डालें";

    document.getElementById("address").placeholder =
      "पता";

    document.getElementById("signupPassword").placeholder =
      "पासवर्ड बनाएं";

    document.getElementById("reEnterPassword").placeholder =
      "पासवर्ड की पुष्टि करें";

    /* Buttons */

    document.getElementById("loginBtn").innerText =
      "लॉगिन";

    document.getElementById("signupBtn").innerText =
      "साइनअप";

    /* Text */

    document.getElementById("newCustomerText").innerHTML =
      'नए ग्राहक? <a href="#" onclick="showSignup()">अकाउंट बनाएं</a>';

    document.getElementById("alreadyAccountText").innerHTML =
      'पहले से अकाउंट है? <a href="#" onclick="hideSignup()">लॉगिन</a>';
  }

  else {

    location.reload();
  }
}