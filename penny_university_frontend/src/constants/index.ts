const ApiRoutes = {
  user: 'auth/user/',
  userProfile: 'users/profile/',
  login: 'auth/login/',
  register: 'auth/register/',
  logout: 'auth/logout/',
  exists: 'auth/exists/',
  chats: 'chats/',
  chatDetail: (id: number) => `chats/${id}/`,
  userChats: (userID: string) => `chats/?participants__user_id=${userID}`,
  updateUser: (id: string) => `users/${id}/`,
  resendEmail: 'auth/verification-email/',
  verifyEmail: 'auth/verify/',
  requestPasswordReset: 'auth/password/reset/',
  resetPassword: 'auth/password/reset/confirm/',
}

export const Routes = {
  Profile: '/profile/:id',
  Chats: '/chats',
  ChatDetail: '/chats/:id',
  Home: '/',
  ResetPassword: '/reset-password',
  VerifyEmail: '/verify',
}

export default ApiRoutes
