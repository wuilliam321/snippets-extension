const main = require('./main');

const formLogin = document.getElementById("form-login")

formLogin.addEventListener("submit", doLogin)

function doLogin() {
    const inputEmail = document.getElementById("email");
    const inputPassword = document.getElementById("password");
    main.isFormValid(inputEmail.value, inputPassword.value);
}
