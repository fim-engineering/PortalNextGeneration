import { removeCookie } from '@helper/Cookie';
import CONSTANT from '@constant';

const logout = ({ onLogoutSuccess = () => {} }) => {
  if (window.gapi) {
    const auth2 = window.gapi.auth2.getAuthInstance()
    if (auth2 != null) {
      auth2.signOut().then(auth2.disconnect().then((response) => {
        console.log("response logout: ", response)
        removeCookie(CONSTANT.TOKEN_NAME)
        onLogoutSuccess()
      }))
    }
  }
}

export {
  logout
}