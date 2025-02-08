export default class RegisterController {
  constructor(router, auth, registerView) {
    this.router = router;
    this.auth = auth;
    this.registerView = registerView;

    // Get DOM references
    this.lms = this.registerView.getRegisterLms();

    // Attach events
    this.lms.registerFormLm.addEventListener('submit', this.registerUser.bind(this));
  }

  registerUser(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    this.registerView.updateSubmitBtn('Loading...');

    this.auth.handleUserRegistration(formData)
      .then(data => {
        this.router.navigateTo('/login');
      })
      .catch(error => {
        console.error(error.message);
        this.registerView.clearErrorMessages(error.data.errors);
      })
      .finally(() => {
        this.registerView.updateSubmitBtn('Register');
      });
  }
}