import { GoogleLogin } from 'react-google-login';
const { GOOGLE_CLIENT_ID } = process.env

class Login extends React.Component {

  responseGoogle = (response) => {
    console.log(response);
  }

  render() {
    console.log("process.env.API_HOST: ", GOOGLE_CLIENT_ID)
    return <React.Fragment>
      <GoogleLogin
        clientId={GOOGLE_CLIENT_ID}
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