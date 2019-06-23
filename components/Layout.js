import React, { Component, useState } from 'react';
import Head from 'next/head';
import '../static/css/empty.css'
import { Layout as LayoutAntd, Menu, Breadcrumb, Icon, Avatar } from 'antd';
import Router from 'next/router'

const { Header, Footer, Sider, Content } = LayoutAntd;
const { SubMenu } = Menu;

function Layout(props) {
  const [collapsed, setCollapsed] = useState(false);
  const { children } = props;

  const onCollapse = collapsed => {
    console.log("collapsed: ", collapsed)
    setCollapsed(collapsed)
  }

  const handleRoute = path => {
    Router.push(path)
  }

  return (
    <LayoutAntd style={{ minHeight: '100vh' }}>
      <Sider theme="light" collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <div className="logo" />
        <Menu theme="light" defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item onClick={() => { handleRoute('/') }} key="1">
            <Icon type="desktop" />
            <span>Home</span>
          </Menu.Item>
          <Menu.Item onClick={() => { handleRoute('/about') }} key="2">
            <Icon type="compass" />
            <span>About</span>
          </Menu.Item>
          {/*
          <SubMenu
            key="sub1"
            title={
              <span>
                <Icon type="user" />
                <span>User</span>
              </span>
            }
          >
            <Menu.Item key="3">Tom</Menu.Item>
            <Menu.Item key="4">Bill</Menu.Item>
            <Menu.Item key="5">Alex</Menu.Item>
          </SubMenu>
          <SubMenu
            key="sub2"
            title={
              <span>
                <Icon type="team" />
                <span>Team</span>
              </span>
            }
          >
            <Menu.Item key="6">Team 1</Menu.Item>
            <Menu.Item key="8">Team 2</Menu.Item>
          </SubMenu>
          <Menu.Item key="9">
            <Icon type="file" />
            <span>File</span>
          </Menu.Item>
          */}
          <Menu.Item onClick={() => { handleRoute('/faq') }} key="10">
            <Icon type="question-circle" />
            <span>FAQ</span>
          </Menu.Item>
          <Menu.Item onClick={() => { handleRoute('/login') }} key="11">
            <Icon type="login" />
            <span>Login</span>
          </Menu.Item>
        </Menu>
      </Sider>
      <LayoutAntd>
        <Content style={{ margin: '16px' }}>
          <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
          {children}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>FIM Engineering ©2019</Footer>
      </LayoutAntd>
    </LayoutAntd>
  )
}

export default Layout