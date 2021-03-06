import React, { useState } from "react";
import Router from 'next/router';
import { Menu, Button } from 'antd';
import {
    AppstoreOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    PieChartOutlined,
    DesktopOutlined,
    ContainerOutlined,
    MailOutlined,
} from '@ant-design/icons';


const MenuAdmin = props => {

    const [collapsed, setCollapsed] = useState(false);


    const toggleCollapsed = () => {
        setCollapsed(!collapsed)
    }

    return (
        <div style={{ width: 256 }}>
            <Button type="primary" onClick={toggleCollapsed} style={{ marginBottom: 16 }}>
                {/* {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} */}
            </Button>
            <Menu
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                mode="inline"
                theme="dark"
                inlineCollapsed={collapsed}
            >
                <Menu.Item key="1" icon={<PieChartOutlined />}>
                    Option 1
          </Menu.Item>
                <Menu.Item key="2" icon={<DesktopOutlined />}>
                    Option 2
          </Menu.Item>
                <Menu.Item key="3" icon={<ContainerOutlined />}>
                    Option 3
          </Menu.Item>
            </Menu>
        </div>
    )
}

export default MenuAdmin;