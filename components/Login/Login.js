import { GoogleLogin } from 'react-google-login';
import axios from 'axios';
import { fetch } from '@helper/fetch';
import { Spin } from 'antd';

class Login extends React.Component {

  state = {
    isLoading: false
  }

  onSuccessLogin = async (res) => {
    
    const { profileObj, googleId, imageUrl, givenName, familyName } = res;

    try {

      const data = await fetch({
        url: '/auth/login',
        method: 'post',
        data: {
            email: profileObj.email,
            socialId: googleId,
            loginSource: "Google",
            profilPicture: imageUrl,
            firstName: givenName,
            lastName: familyName
        },
      })
  
      console.log("data: ", data)
      this.onToggleLoader();
    } catch (error) {
      this.onToggleLoader();
      console.log("error: ", error)
    }
  }

  responseGoogle = async (response) => {
    console.log(response);

    this.onToggleLoader();
    if (response.accessToken) {
      this.onSuccessLogin(response)
    } else {
      this.onToggleLoader();
      console.log("GAGAL GOOGLE")
    }
    
  }

  onToggleLoader = () => {
    this.setState(prevState => ({ isLoading: !prevState.isLoading }))
  }

  render() {
    const { isLoading } = this.state;

    return <React.Fragment>
      <Spin spinning={isLoading} tip="Loading..." >
        <GoogleLogin
          clientId={process.env.GOOGLE_CLIENT_ID}
          buttonText="Login"
          onSuccess={this.responseGoogle}
          onFailure={this.responseGoogle}
          cookiePolicy={'single_host_origin'}
          uxMode="popup"
        />
      </Spin>
    </React.Fragment>;
  }
}

export default Login;