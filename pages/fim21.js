import React, { Component } from 'react';
import requireLogin from '@HoC/requireLogin';
import {auth} from '@HoC/withAuth';
import Container from '@components/FIM21'

function fim21(props) {
  return <Container {...props} />
}

fim21.getInitialProps = async ctx => {
  // Check user's session
  const { token_FIM, step } = await auth(ctx);

  return { token_FIM, step }
}

export default fim21;