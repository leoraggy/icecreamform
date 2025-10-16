document.getElementById("icecream-form").onsubmit = () => {
  clearErrors();
  // flag variable to determine if form data is valid
  let isValid = true;
  let fname = document.getElementById("fname").value.trim();
  let email = document.getElementById("email").value.trim();
  let flavor = document.getElementById("flavor").value.trim();

  if (!fname) {
    isValid = false;
    document.getElementById("err-fname").style.display = "block";
  }

  if (!email || email.indexOf("@") === -1) {
    isValid = false;
    document.getElementById("err-email").style.display = "block";
  }

  if (flavor == "none") {
    isValid = false;
    document.getElementById("err-flavor").style.display = "block";
  }

  let methodButtons = document.getElementsByName("cone");
  let count = 0;
  for (let i = 0; i < methodButtons.length; i++) {
    if (methodButtons[i].checked) {
      count++;
    }
  }
  if (count === 0) {
    document.getElementById("err-cone").style.display = "block";
    isValid = false;
  }

  return isValid;
};

function clearErrors() {
  let errors = document.getElementsByClassName("error");
  for (let error of errors) {
    error.style.display = "none";
  }
}
