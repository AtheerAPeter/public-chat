//when sigup button pressed
function create_account() {
  var userEmail = document.getElementById("email_field").value;
  var userPassword = document.getElementById("password_field").value;
  firebase
    .auth()
    .createUserWithEmailAndPassword(userEmail, userPassword)
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // showing the error message in an element in the dom
      var errorElement = document.getElementById("error_message");
      errorElement.style.display = "flex";
      errorElement.innerHTML = errorMessage;
    });

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // getting the username from username field to update the profile with
      var userName = document.getElementById("username_field").value;

      user
        .updateProfile({
          // <-- Update Method here

          displayName: userName,
        })
        .then(
          function () {
            // Profile updated successfully!
            //  "NEW USER NAME"
            var displayName = user.displayName;
            //getting the display name connected to the authenticated user from the database to the local storage for speed also if the user used another browser or cleared browser cache and data
            localStorage.setItem("uname", displayName);
            console.log(displayName);
            window.location.replace("index.html");
          },
          function (error) {
            // An error happened.
          }
        );
      // if not logged in
    } else {
    }
  });
}
