import Router from 'next/router'
import nextCookie from 'next-cookies'
import CONSTANT from '@constant';
import { fetch } from '@helper/fetch';
import { logout } from '@helper/googleSession';
import { removeCookie } from '@helper/Cookie';
import { notification } from 'antd';

const openNotificationWithIcon = type => {
  notification[type]({
    message: 'Anda harus login terlenih dahulu'
  });
}

const redirectForbidden = () => {
  openNotificationWithIcon('error')
  removeCookie(CONSTANT.TOKEN_NAME)
  logout({
    onLogoutSuccess: () => {}
  })
  Router.push('/login')
}

export const auth = async ctx => {

  const { [CONSTANT.TOKEN_NAME]: token_FIM } = nextCookie(ctx)

  console.log("token_FIM: ", token_FIM)

  if (ctx.req && !token_FIM) {
    ctx.res.writeHead(302, { Location: '/login' })
    ctx.res.end()
    return {}
  }

  if (!token_FIM) {
    redirectForbidden()
    return {}
  }

  try {
    const response = await fetch({
      url: '/auth/checksession',
      method: 'post',
      data: {
        token: token_FIM
      }
    })

    const status = (response.data.status || false)

    if (!status) {
      redirectForbidden()
    }

    return {
      token_FIM,
      step: response.data.data.step
    }

  } catch (error) {
    console.log("error: ", error)
    redirectForbidden()
    return {}
  }

  return {
    token_FIM,
    step: 0
  }
}