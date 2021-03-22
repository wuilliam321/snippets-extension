import axios from 'axios';
import main from './main';

const formLogin = document.getElementById('form-login');

formLogin.addEventListener('submit', doLogin);

function doLogin(event) {
  event.preventDefault();

  const inputEmail = document.getElementById('email');
  const inputPassword = document.getElementById('password');
  const formError = document.getElementById('form-error');

  if (main.isFormValid(inputEmail.value, inputPassword.value)) {
    const Url = 'https://app.capijzo.com/api/auth/login';
    // hacer POST al login
    axios({
      method: 'POST',
      url: Url,
      data: {
        email: inputEmail.value,
        password: inputPassword.value,
      },
    })
      .then((data) => {
        // guardar el token en la pc
        // mostrar el dashboard con el boton logout, (no quiero el form)
        console.log(data);
        chrome.storage.sync.set({ data: data.data.access_token }, () => {
          console.log(data.data.access_token);
        });
      })
      .catch((err) => {
        // mostrar un error si no pudo hacerse el login correctament
        console.log(err);
        formError.style.display = 'block';
      });
    formError.style.display = 'none';
  } else {
    // mostrar que el formulario esta invalido "Incorrect email or password"
    formError.style.display = 'block';
  }
}
