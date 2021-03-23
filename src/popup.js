// import main from './main';

// const formLogin = document.getElementById('form-login');

// formLogin.addEventListener('submit', doLogin);

// async function doLogin(event) {
//   event.preventDefault();

//   const inputEmail = document.getElementById('email');
//   const inputPassword = document.getElementById('password');
//   const formError = document.getElementById('form-error');

//   formError.style.display = 'none';

//   if (!main.isFormValid(inputEmail.value, inputPassword.value)) {
//     formError.style.display = 'block';
//     return;
//   }

//   // hacer POST al login
//   try {
//     const data = await main.login(inputEmail.value, inputPassword.value);
//     // mostrar el dashboard con el boton logout, (no quiero el form)
//     console.log('success', data);

//     // guardar el token en la pc
//     // chrome.storage.sync.set({ data: data.data.access_token }, () => {
//     //   console.log(data.data.access_token);
//     // });
//   } catch (err) {
//     console.log('error', err.status);
//     formError.style.display = 'block';
//   }
// }

import Vue from 'vue';
import App from './components/App.vue';

new Vue({ render: createElement => createElement(App) }).$mount('#app');
