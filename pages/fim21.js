import React, { Component } from 'react';
import requireLogin from '@HoC/requireLogin';
import {auth} from '@HoC/withAuth';
import {withUser} from '@HoC/withUser';
import Container from '@components/FIM21'

// function fim21(props) {
//   return <Container {...props} />
// }

class fim21 extends Component {
  static getInitialProps = async (ctx) => {
    const { token_FIM, step } = await auth(ctx);
    const { dataUser } = await withUser(ctx)

    return { token_FIM, step, dataUser }
  }

  render() {
    console.log("this.props fim21: ", this.props)

    return <Container {...this.props} />
  }
}

// fim21.getInitialProps = async ctx => {
//   // Check user's session
//   const { token_FIM, step } = auth(ctx);
//   const { dataUser } = withUser(ctx)

//   return { token_FIM, step, dataUser }
// }

// export default requireLogin(fim21);
export default fim21;