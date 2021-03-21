const main = require('./main');

const formLogin = document.getElementById("form-login")

formLogin.addEventListener("submit", doLogin)

function doLogin(event) {
    event.preventDefault();

    const inputEmail = document.getElementById("email");
    const inputPassword = document.getElementById("password");
    const formError = document.getElementById("form-error");

    if (main.isFormValid(inputEmail.value, inputPassword.value)) {
        // hacer POST al login
        // guardar el token en la pc
        // mostrar el dashboard con el boton logout, (no quiero el form)
        // mostrar un error si no pudo hacerse el login correctament
        formError.style.display = 'none';
    } else {
        // mostrar que el formulario esta invalido "Incorrect email or password"
        formError.style.display = 'block';
    }
}