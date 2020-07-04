//check if the user accessing this page is authenticated, if not then redirect him to the login page
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    document.getElementById("container").style.display = "block";
  } else {
    window.location.replace("index.html");
    // redirect to login page
  }
});

//getting the chosen room the user selected from the local storage
var room = localStorage.getItem("room");
// setting the name of the room into the title bar of the chat
document.getElementById("room_title").innerText = room;
//get the username from the local storage for speed
var myName = localStorage.getItem("uname");
//show message that the user has joined
firebase
  .database()
  .ref(room)
  .push()
  .set({
    sender: "💻System💻",
    message: myName + " has joined 😃 ",
  });

// function that will push message after submitting to the firebase database
function sendMessage() {
  //getting the input element"s value
  var message = document.getElementById("message").value;
  //emptying it
  document.getElementById("message").value = "";
  //focus again on it so the keyboard doesnt disappear
  document.getElementById("message").focus();
  //push the content to the firebase database with the specific chosen room name
  firebase.database().ref(room).push().set({
    sender: myName,
    message: message,
  });

  return false;
}
// listener for incoming new messages then constructing them into html Li elements inside the ul

firebase
  .database()
  .ref(room)
  .on("child_added", function (snapshot) {
    var html = "";
    html += "<li id='message-" + snapshot.key + "'>";
    html += "<div>";
    html += "<h4>";
    html += snapshot.val().sender;
    html += "</h4>";
    html += "<p>";
    html += snapshot.val().message;
    html += " </p>";
    html += "</div>";
    // if sender name in database is equal to the username then make him a delete button
    if (snapshot.val().sender == myName) {
      html +=
        "<button data-id='" + snapshot.key + "'onclick='deleteMessage(this);'>";
      html += " <img src='./img/delete.svg';> ";
      html += "</img>";
      html += "</button>";
    }
    html += "</li>";
    // a function to send a notification for each new message
    notifications(snapshot.val().message);

    document.getElementById("messages").innerHTML += html;
    // applying specific CSS rules and animations to user's own messages for look
    if (snapshot.val().sender == myName) {
      var my_message = document.getElementById("message-" + snapshot.key);
      my_message.classList.add("my-message");
      my_message.classList.add("animate");

      $("li").on("animationend", function () {
        $(this).removeClass("animate");
      });
    }
    // to stick the view down to the new messages in the scroll box
    updateScroll();
  });
// if the delete button is pressed
function deleteMessage(self) {
  var messageId = self.getAttribute("data-id");
  firebase.database().ref(room).child(messageId).remove();
  firebase
    .database()
    .ref(room)
    .on("child_removed", function (snapshot) {
      document.getElementById("message-" + snapshot.key).innerHTML =
        "This message has been removed";
    });
}

function updateScroll() {
  var element = document.getElementById("message-box");
  element.scrollTop = element.scrollHeight;
}

//when back button is pressed
function goback() {
  window.location.replace("rooms.html");
}

//when get notification button is pressed
function notifications(msg) {
  // request permission from user,  the tag is to prevent notification spam since firebase will load all messages on start up so it will spam
  Notification.requestPermission().then((perm) => {
    if (perm == "granted") {
      new Notification("New message", {
        body: msg,
        tag: "soManyNotification",
      });
      console.log("granted");
    } else if (perm == "denied") {
      alert("denied");
    }
  });
}
