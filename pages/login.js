import { GoogleLogin } from 'react-google-login';
import axios from 'axios';

class Login extends React.Component {

  onSuccessLogin = async (res) => {
    
    const { profileObj, googleId, imageUrl, givenName, familyName } = res;

    try {
      
      const data = await axios.post(`${process.env.URL_BACKEND}/auth/login`, {
        email: profileObj.email,
        socialId: googleId,
        loginSource: "Google",
        profilPicture: imageUrl,
        firstName: givenName,
        lastName: familyName
      })
  
      console.log("data: ", data)
      
    } catch (error) {
      console.log("error: ", error)
    }
  }

  responseGoogle = async (response) => {
    console.log(response);


    if (response.accessToken) {
      this.onSuccessLogin(response)
    } else {
      console.log("GAGAL GOOGLE")
    }
    
  }

  render() {
    console.log("process.env.API_HOST: ", process.env.GOOGLE_CLIENT_ID)
    console.log("process.env.URL_BACKEND: ", process.env.URL_BACKEND)
    return <React.Fragment>
      <GoogleLogin
        clientId={process.env.GOOGLE_CLIENT_ID}
        buttonText="Login"
        onSuccess={this.responseGoogle}
        onFailure={this.responseGoogle}
        cookiePolicy={'single_host_origin'}
        uxMode="popup"
      />,
    </React.Fragment>;
  }
}

export default Login;