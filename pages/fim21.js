import React from 'react';
import requireLogin from '@HoC/requireLogin';
import Container from '@components/FIM21'

function fim21(props) {
  return <Container {...props} />
}

export default requireLogin(fim21);