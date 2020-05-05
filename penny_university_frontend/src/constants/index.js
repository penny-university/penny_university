
const ApiRoutes = {
  user: 'auth/user/',
  userProfile: 'users/profile/',
  userProfileDetail: (id) => `users/profile${id}`,
  login: 'auth/login/',
  register: 'auth/register/',
  logout: 'auth/logout/',
  exists: 'auth/exists/',
}

export default ApiRoutes
