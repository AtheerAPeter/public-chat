firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    document.getElementById("uname").defaultValue = user.displayName;
    // hide and show the welcome screen if logged in
    document.getElementById("login_div").style.display = "none";
    document.getElementById("user_div").style.display = "flex";

    var user = firebase.auth().currentUser;
    if (user != null) {
      var email_id = user.email;
      document.getElementById("thanks").innerHTML = "Welcome <br> " + email_id;
    }
    // if not ligged in
  } else {
    document.getElementById("login_div").style.display = "flex";
    document.getElementById("user_div").style.display = "none";
  }
});

function login() {
  var userEmail = document.getElementById("email_field").value;
  var userPassword = document.getElementById("password_field").value;
  firebase
    .auth()
    .signInWithEmailAndPassword(userEmail, userPassword)
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      //send the error message into an element in the dom
      var errorElement = document.getElementById("error_message");
      errorElement.style.display = "flex";
      errorElement.innerHTML = errorMessage;
    });
}

function signupRedirect() {
  window.location.replace("signup.html");
}

function logout() {
  firebase
    .auth()
    .signOut()
    .then(function () {})
    .catch(function (error) {});
}

function redirect() {
  var name = document.getElementById("uname");
  localStorage.setItem("uname", name.value);
  window.location.replace("rooms.html");
}
