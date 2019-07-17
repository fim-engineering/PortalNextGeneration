import { GoogleLogin } from 'react-google-login';
import axios from 'axios';
import { fetch } from '@helper/fetch';
import { Spin, Button, message } from 'antd';
import { set } from '@LocalStorage';
import { setCookie } from '@Cookie';
import CONSTANT from '@constant';
import Router from 'next/router';
import { notification } from 'antd';
import { logout } from '@helper/googleSession';
import { sendTracker } from '@tracker';
class Login extends React.Component {

  state = {
    isLoading: false
  }

  openNotificationWithIcon = type => {
    notification[type]({
      message: 'Berhasil Login'
    });
  };

  redirectAfterSuccess = () => {
    Router.push('/fim21')
  }

  redirectAfterSuccessLogout = () => {
    message.success('Berhasil Logout')
    Router.push('/')
  }

  onSuccessLogin = async (res) => {
    
    const { profileObj, googleId, imageUrl, givenName, familyName } = res;

    try {

      const response = await fetch({
        url: '/auth/login',
        method: 'post',
        data: {
          email: profileObj.email,
          socialId: googleId,
          loginSource: "Google",
          profilPicture: profileObj.imageUrl,
          firstName: profileObj.givenName,
          lastName: profileObj.familyName
        },
      })
  
      setCookie(CONSTANT.TOKEN_NAME, response.data.token)
      this.openNotificationWithIcon('success')
      this.redirectAfterSuccess()
      this.onToggleLoader();

      sendTracker({ 
        eventCategory: 'Login',
        eventAction: 'ResponseAPI',
        eventLabel: 'success',
        dimension1: JSON.stringify(response)
      })

    } catch (error) {
      this.onToggleLoader();
      console.log("error: ", error)
      sendTracker({ 
        eventCategory: 'Login',
        eventAction: 'ResponseAPI',
        eventLabel: 'failed',
        dimension1: JSON.stringify(error)
      })
    }
  }

  responseGoogle = async (response) => {

    this.onToggleLoader();
    if (response.accessToken) {
      this.onSuccessLogin(response)
      sendTracker({ 
        eventCategory: 'Login',
        eventAction: 'ResponseGoogle',
        eventLabel: 'success',
        dimension1: JSON.stringify(response)
      })
    } else {
      sendTracker({ 
        eventCategory: 'Login',
        eventAction: 'ResponseGoogle',
        eventLabel: 'failed',
        dimension1: JSON.stringify(response)
      })
      this.onToggleLoader();
      console.log("GAGAL GOOGLE")
    }
    
  }

  onToggleLoader = () => {
    this.setState(prevState => ({ isLoading: !prevState.isLoading }))
  }

  render() {
    const { isLoading } = this.state;
    const { cookieLogin } = this.props;

    return <React.Fragment>
      <Spin spinning={isLoading} tip="Loading..." >
        {
          cookieLogin ? 
          <Button onClick={() => {
            logout({
              onLogoutSuccess: () => { this.redirectAfterSuccessLogout() }
            })
          }} type="primary" key="console">
            Logout
          </Button>
          :
          <GoogleLogin
            clientId={process.env.GOOGLE_CLIENT_ID}
            buttonText="Login"
            onSuccess={this.responseGoogle}
            onFailure={this.responseGoogle}
            cookiePolicy={'single_host_origin'}
            uxMode="popup"
          />
        }
      </Spin>
    </React.Fragment>;
  }
}

export default Login;
