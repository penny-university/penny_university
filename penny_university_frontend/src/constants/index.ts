
const ApiRoutes = {
  user: 'auth/user/',
  userProfile: 'users/profile/',
  userProfileDetail: (id: string) => `users/profile${id}`,
  login: 'auth/login/',
  register: 'auth/register/',
  logout: 'auth/logout/',
  exists: 'auth/exists/',
  chats:  'chats/',
  chatDetail: (id: number) => `chats/${id}/`,
}

export const Routes = {
  Home:"/",
  ChatDetail: "/chats/:id",
  Chats: "/chats",
}

export default ApiRoutes
