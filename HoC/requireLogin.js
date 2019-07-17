import React, { Component } from 'react';
import { fetch } from '@helper/fetch';
import { removeCookie } from '@helper/Cookie';
import CONSTANT from '@constant';
import { notification } from 'antd';
import Router from 'next/router';

// This function takes a component...
export default function requireLogin(WrappedComponent) {
  // ...and returns another component...
  return class HoCUser extends Component {
  
    state = {
      step: 0
    }

    openNotificationWithIcon = type => {
      notification[type]({
        message: 'Anda harus login terlebih dahulu'
      });
    }

    checkSession = async () => {
      const { cookieLogin } = this.props;

      try {
        const response = await fetch({
          url: '/auth/checksession',
          method: 'post',
          data: {
            token: cookieLogin
          }
        })

        const status = (response.data.status || false)

        if (!status) {
          return this.redirectNonLogin();
        }

        const data = response.data.data || {}

        this.setState({ step: data.step })

      } catch (error) {
        console.log("error: ", error);
        
        this.redirectNonLogin();
      }
    }

    redirectNonLogin = () => {
      removeCookie(CONSTANT.TOKEN_NAME)
      Router.push('/login');
      this.openNotificationWithIcon('error')
    }

    componentDidMount() {
      const { cookieLogin } = this.props;
      
      this.checkSession();
    }
  
    render() {
      const { step } = this.state;

      return <WrappedComponent {...this.props} step={step} />;
    }
  
  }

}