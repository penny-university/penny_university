
const ApiRoutes = {
  user: 'auth/user/',
  userProfile: 'users/profile/',
  login: 'auth/login/',
  register: 'auth/register/',
  logout: 'auth/logout/',
  exists: 'auth/exists/',
  chats:  'chats/',
  chatDetail: (id: number) => `chats/${id}/`,
  userChats: (userID: string) => `chats/?participants__user_id=${userID}`
}

export const Routes = {
  profile: '/profile',
  chats: '/chats',
  chatDetail: '/chats/:id',
  home: '/',
}

export default ApiRoutes
