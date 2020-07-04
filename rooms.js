function selectRoom() {
  var select = document.getElementById("select");
  localStorage.setItem("room", select.value);

  location.reload();
}

function redirect2() {
  window.location.replace("index.html");
}
