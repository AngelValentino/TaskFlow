import DashboardView from "./views/Dashboard.js";
import RegisterView from "./views/Register.js";
import LoginView from "./views/Login.js";
import Router from './services/Router.js';

document.addEventListener('DOMContentLoaded', () => {
  // Instantiate Router class
  const router = new Router();
  const appLm = document.getElementById('App');

  // Add routes
  router.addRoute('/', () => {
    const view = new DashboardView();

    view.getHtml()
      .then(html => {
        appLm.innerHTML = html;
      })
      .catch(error => console.error('Error fetching HTML:', error));
  });

  router.addRoute('/register', () => {
    const view = new RegisterView();

    view.getHtml()
      .then(html => {
        appLm.innerHTML = html;

        // TODO Refactor this to be used from userModel class

        async function registerUser(formData) {
          const response = await fetch('http://localhost/taskflow-api/register', {
            method: 'POST',
            body: formData
          });

          // Validation error
          if (response.status === 422) {
            const errorData = await response.json();
            const error = new Error('Validation error occurred');
            error.data = errorData; // Attach the full error data
            throw error;
          }

          // API error
          if (!response.ok) {
              throw new Error(`Couldn't properly register the user, try again later`);
          }

          const data = await response.json();
          return data;
        }


        document.getElementById('register-form').addEventListener('submit', e => {
          e.preventDefault(); // Prevent the default form submission
          
          // Create a FormData object from the form
          const formData = new FormData(e.target);
  
          formData.forEach((value, key) => {
            console.log(`${key} = ${value}`);
          });

          const usernameErrorLm = document.getElementById('username-error');
          const emailErrorLm = document.getElementById('email-error');
          const passwordErrorLm = document.getElementById('password-error');
          const submitBtn = document.getElementById('register-form__submit-btn');

          submitBtn.innerText = 'Loading...'

          registerUser(formData)
            .then(data => {
              usernameErrorLm.textContent = '';
              emailErrorLm.textContent = '';
              passwordErrorLm.textContent = '';

              router.navigateTo('/login');
            })
            .catch(error => {
              console.error(error.message);

              usernameErrorLm.textContent = error.data.errors.username || '';
              emailErrorLm.textContent = error.data.errors.email || '';
              passwordErrorLm.textContent = error.data.errors.password || '';
            })
            .finally(() => {
              submitBtn.innerText = 'Register';
            });
        });
      })
      .catch(error => console.error('Error fetching HTML:', error));
  });

  router.addRoute('/login', () => {
    const view = new LoginView();

    view.getHtml()
      .then(html => {
        appLm.innerHTML = html;
      })
      .catch(error => console.error('Error fetching HTML:', error));
  });

  // Dispatch to the correct route
  router.dispatch();
});
