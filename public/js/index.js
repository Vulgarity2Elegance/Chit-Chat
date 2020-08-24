$(document).ready(() => {
  // Getting references to our form and input
  const signUpForm = $("form.signup");
  const signupEmail = $("input#email-input");
  const signupPassword = $("input#password-input");

  // Does a post to the signup route. If successful, we are redirected to the members page
  // Otherwise we log any errors
  const signUpUser = (email, password) => {
    $.post("/api/signup", {
      email: email,
      password: password,
    })
      .then(() => {
        window.location.replace("/members");
        // If there's an error, handle it by throwing up a bootstrap alert
      })
      .catch(handleLoginErr);
  };

  const handleLoginErr = (err) => {
    $("#alert .msg").text(JSON.stringify(err.responseJSON));
    $("#alert").fadeIn(500);
  };

  // When the signup button is clicked, we validate the email and password are not blank
  signUpForm.on("submit", (event) => {
    event.preventDefault();
    const userData = {
      email: signupEmail.val().trim(),
      password: signupPassword.val().trim(),
    };

    if (!userData.email || !userData.password) {
      return;
    }
    // If we have an email and password, run the signUpUser function
    signUpUser(userData.email, userData.password);
    signupEmail.val("");
    signupPassword.val("");
  });

  // Getting references to login form and inputs
  const loginForm = $("form.login");
  const emailInput = $("input#loginEmail");
  const passwordInput = $("input#loginPassword");

  // When the form is submitted, we validate there's an email and password entered
  loginForm.on("submit", (event) => {
    event.preventDefault();
    const userData = {
      email: emailInput.val().trim(),
      password: passwordInput.val().trim(),
    };

    if (!userData.email || !userData.password) {
      return;
    }

    // If we have an email and password we run the loginUser function and clear the form
    loginUser(userData.email, userData.password);
    emailInput.val("");
    passwordInput.val("");
  });

  // loginUser does a post to our "api/login" route and if successful, redirects us the the members page
  function loginUser(email, password) {
    $.post("/api/login", {
      email: email,
      password: password,
    })
      .then(() => {
        window.location.replace("/members");
        // If there's an error, log the error
      })
      .catch((err) => {
        console.log(err);
      });
  }
});
