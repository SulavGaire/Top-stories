document
  .getElementById("newsletterForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    var email = document.getElementById("email").value;

    if (validateEmail(email)) {
      console.log(email);
      alert("Thank you for signing up!");
    } else {
      alert("Please enter a valid email address.");
    }
  });

function validateEmail(email) {
  var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

