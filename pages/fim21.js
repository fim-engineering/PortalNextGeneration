import React, { Component } from 'react';
import requireLogin from '@HoC/requireLogin';
import {auth} from '@HoC/withAuth';
import {withUser} from '@HoC/withUser';
import Container from '@components/FIM21'

function fim21(props) {
  return <Container {...props} />
}

fim21.getInitialProps = async ctx => {
  // Check user's session
  const { token_FIM, step } = await auth(ctx);
  const { dataUser } = await withUser(ctx)

  return { token_FIM, step, dataUser }
}

export default fim21;