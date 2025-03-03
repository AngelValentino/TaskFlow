export default class Auth {
  loginClient(data) {
    localStorage.setItem('accessToken', data.access_token);
    localStorage.setItem('refreshToken', data.refresh_token);
    localStorage.setItem('username', data.username);
    localStorage.removeItem('tasks');
    localStorage.setItem('taskCount', 0);
  }

  logoutClient() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
    localStorage.removeItem('taskCount');
  }

  isClientLogged() {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const username = localStorage.getItem('username');
    
    if (accessToken && refreshToken && username) {
      return true;
    }
    
    return false;
  }
}