import React, { Component } from 'react';
import Head from 'next/head';

export default class Layout extends Component {
  render() {
    const { children, title, style, className } = this.props;

    return (
      <div className={'main-layout col ' + className} style={style}>
        <Head>
          <title>{title}</title>
          {process.env.NODE_ENV !== 'production' && (
            <link rel="stylesheet" type="text/css" href={'/_next/static/css/styles.chunk.css?v=' + Date.now()} />
          )}
        </Head>
        <div className="main-content">{children}</div>
      </div>
    );
  }
}