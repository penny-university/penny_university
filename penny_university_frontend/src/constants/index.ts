
const ApiRoutes = {
  user: 'auth/user/',
  userProfile: 'users/profile/',
  userProfileDetail: (id: string) => `users/profile${id}`,
  login: 'auth/login/',
  register: 'auth/register/',
  logout: 'auth/logout/',
  exists: 'auth/exists/',
  chats:  'chats/',
}

export default ApiRoutes
