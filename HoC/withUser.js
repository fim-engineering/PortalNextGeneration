import Router from 'next/router'
import nextCookie from 'next-cookies'
import CONSTANT from '@constant';
import { fetch } from '@helper/fetch';
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
  Router.push('/login')
}

export const withUser = async ctx => {
  const { [CONSTANT.TOKEN_NAME]: token_FIM } = nextCookie(ctx);

  if (ctx.req && !token_FIM) {
    ctx.res.writeHead(302, { Location: '/login' })
    ctx.res.end()
    return
  }

  if (!token_FIM) {
    return redirectForbidden()
  }

  try {
    const response = await fetch({
      url: '/auth/get-profile',
      method: 'post',
      headers: {
        'Authorization': `Bearer ${token_FIM}`
      },
    })

    const status = (response.data.status || false)

    if (!status) {
      redirectForbidden()
    }

    console.log("response profile: ", response.data.data)

    return {
      dataUser: response.data.data
    }

  } catch (error) {
    console.log("error: ", error)
    redirectForbidden()
    return
  }

  return {
    dataUser: {}
  }

}