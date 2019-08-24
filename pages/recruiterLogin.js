import LoginComponent from '@components/Login';
;

class recruiterLogin extends React.Component {

  render() {
    return <React.Fragment>
      <LoginComponent cookieLogin={this.props.cookieLogin} />
      {/* <h1>Pendaftaran Ditutup!</h1> */}
    </React.Fragment>;
  }
}

export default recruiterLogin;