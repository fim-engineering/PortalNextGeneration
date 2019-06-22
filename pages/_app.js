import React from 'react';
import App, { Container } from 'next/app';
import Layout from '../components/Layout';

class MyApp extends App {

  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;
    console.log("LOAD __APP>JS")
    return (
      <Container>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Container>
    );
  }
}

export default MyApp;