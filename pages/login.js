import { LoginComponent } from '@components/Login';
;

class Login extends React.Component {

  render() {
    return <React.Fragment>
      <h1>Login Page</h1>
      <LoginComponent />
    </React.Fragment>;
  }
}

export default Login;