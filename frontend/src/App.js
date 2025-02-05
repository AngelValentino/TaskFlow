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

        // TODO Properly render errors, and redirect the user to login if he was
        // TODO correctly registered

        // TODO Refactor this to be used from userModel class

        document.getElementById('register-form').addEventListener('submit', event => {
          event.preventDefault(); // Prevent the default form submission
          
          // Create a FormData object from the form
          const formData = new FormData(document.getElementById('register-form'));
  
          formData.forEach((value, key) => {
            console.log(`${key} = ${value}`);
          });

          fetch('http://localhost/taskflow-api/register', {
            method: 'POST',
            body: formData
          })
          .then(response => {
            console.log(response.status)

            if (response.status === 422) {
                // If the response is not ok, parse the error JSON and log the message
                return response.json().then(errorData => {
                    throw errorData;
                });
            }

            if (!response.ok) {
              throw new Error(`Couldn't properly register the user, try again later`);
            }

            return response.json(); // Proceed with the response body if status is OK
          })
          .then(data => {
            document.getElementById('response-message').textContent = data.message;
          })
          .catch(error => {
            // Handle any errors that occur during the request
            console.error('Error during login:', error);
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
