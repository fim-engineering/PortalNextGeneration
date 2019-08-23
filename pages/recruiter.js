import LoginComponent from '@components/Login';
import AddListRecruiter from '../components/Recruiter/AddListRecruiter';
import requireLogin from '@HoC/requireLogin';

class Recruiter extends React.Component {

  render() {
    return <React.Fragment>
        <AddListRecruiter />
      {/* <LoginComponent cookieLogin={this.props.cookieLogin} /> */}
      {/* <h1>Pendaftaran Ditutup!</h1> */}
    </React.Fragment>;
  }
}

export default Recruiter;