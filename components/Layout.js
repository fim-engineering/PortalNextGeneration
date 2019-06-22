import React, { Component } from 'react';
import Head from 'next/head';
import '../static/css/empty.css'

export default class Layout extends Component {
  render() {
    const { children, title, style, className } = this.props;

    return (
      <div className={'main-layout col ' + className} style={style}>
        <Head>
          <title>{title? title : ''}</title>
        </Head>
        <div className="main-content">{children}</div>
      </div>
    );
  }
}