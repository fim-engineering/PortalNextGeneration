import React from 'react';
import requireLogin from '@HoC/requireLogin';
import Container from '@components/FIM21'

function fim21() {
  return <Container />
}

export default requireLogin(fim21);