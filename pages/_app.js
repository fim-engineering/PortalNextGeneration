import React from 'react';
import App, { Container } from 'next/app';
import Layout from '../components/Layout';

import Router from 'next/router';
import NProgress from 'nprogress'

Router.events.on('routeChangeStart', url => {
  console.log(`Loading: ${url}`)
  NProgress.start()
})
Router.events.on('routeChangeComplete', () => {
  if (process.env.NODE_ENV !== 'production') {
    const els = document.querySelectorAll('link[href*="/_next/static/css/styles.chunk.css"]');
    const timestamp = new Date().valueOf();
    els[0].href = '/_next/static/css/styles.chunk.css?v=' + timestamp;
  }

  NProgress.done()
})
Router.events.on('routeChangeError', () => NProgress.done())

class MyApp extends App {

  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps, router } = this.props;
    return (
      <Container>
        <Layout pathName={router.pathname}>
          <Component {...pageProps} />
        </Layout>
      </Container>
    );
  }
}

export default MyApp;