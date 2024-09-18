const isAuthenticated = () => {
  const loggedInUser = window.localStorage.getItem('loggedInUser')
  if (loggedInUser) {
    const user = JSON.parse(loggedInUser)

    const decodedToken = JSON.parse(atob(user.token.split('.')[1]));
    const expirationTime = decodedToken.exp;
    const currentTime = Math.floor(Date.now() / 1000); // in seconds
  
    if (expirationTime < currentTime)
      return false
    else
      return true
  }
}

export default isAuthenticated