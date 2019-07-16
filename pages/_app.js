import React from 'react';
import App, { Container } from 'next/app';
import Layout from '@components/Layout';
import withGA from "next-ga";
import { getCookieUniversal } from '@Cookie';
import * as Sentry from '@sentry/browser';
import CONSTANT from '@constant';

import Router from 'next/router';

Sentry.init({
  dsn: process.env.SENTRY_DSN
});

Router.events.on('routeChangeStart', url => {
  console.log(`Loading: ${url}`)
})
Router.events.on('routeChangeComplete', () => {
  if (process.env.NODE_ENV !== 'production') {
    const els = document.querySelectorAll('link[href*="/_next/static/css/styles.chunk.css"]');
    const timestamp = new Date().valueOf();
    els[0].href = '/_next/static/css/styles.chunk.css?v=' + timestamp;
  }

})
Router.events.on('routeChangeError', (err) => {
  console.log("routeChangeError: ", err)
})

class MyApp extends App {

  componentDidCatch(error, errorInfo) {
    Sentry.withScope((scope) => {
        Object.keys(errorInfo).forEach((key) => {
            scope.setExtra(key, errorInfo[key]);
        });

        Sentry.captureException(error);
    });

    super.componentDidCatch(error, errorInfo);
  }

  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};
    let cookiesInitial = ''

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    
    if (ctx.req) {
      cookiesInitial = ctx.req.headers.cookie;
    } else {
      cookiesInitial = document.cookie;
    }

    const cookieLogin = getCookieUniversal(CONSTANT.TOKEN_NAME, cookiesInitial)
    return { pageProps, cookieLogin };
  }

  render() {
    const { Component, pageProps, router, cookieLogin } = this.props;

    return (
      <Container>
        <Layout pathName={router.pathname} cookieLogin={cookieLogin} >
          <Component {...pageProps} cookieLogin={cookieLogin} />
        </Layout>
      </Container>
    );
  }
}

export default withGA("UA-48323794-5", Router)(MyApp);