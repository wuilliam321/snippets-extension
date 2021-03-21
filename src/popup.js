const main = require('./main');

const formLogin = document.getElementById("form-login")

formLogin.addEventListener("submit", doLogin)

function doLogin() {
    const inputEmail = document.getElementById("email");
    const inputPassword = document.getElementById("password");
    if (!main.isFormValid(inputEmail.value, inputPassword.value)) {
      // mostrar que el formulario esta invalido "Incorrect email or password"
    } else {
      // hacer POST al login
      // guardar el token en la pc
      // mostrar el dashboard con el boton logout, (no quiero el form)
      // mostrar un error si no pudo hacerse el login correctament
    }
}
