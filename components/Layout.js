import React, { Component } from 'react';
import Head from 'next/head';

export default class Layout extends Component {
  render() {
    const { children, title, style, className } = this.props;

    return (
      <div className={'main-layout col ' + className} style={style}>
        <Head>
          <title>{title? title : ''}</title>
          <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/antd/3.19.0/antd.min.css' />
        </Head>
        <div className="main-content">{children}</div>
      </div>
    );
  }
}