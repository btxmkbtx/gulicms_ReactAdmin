import React from 'react';
import {
  AppstoreOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  PieChartOutlined,
  DesktopOutlined,
  ContainerOutlined,
  BarChartOutlined,
  AreaChartOutlined,
  PictureOutlined,
  UserOutlined,
} from '@ant-design/icons';

const menuList = [
  {
    title: 'ホーム', // 菜单标题名称
    key: '/home', // 对应的path
    icon: <AppstoreOutlined />, // 图标名称
    isPublic: true, // 公开的
  },
  {
    title: '商品',
    key: '/products',
    icon: <ContainerOutlined />,
    children: [ // 子菜单列表
      {
        title: '品目管理',
        key: '/category',
        icon: <MenuUnfoldOutlined />
      },
      {
        title: '商品管理',
        key: '/product',
        icon: <MenuFoldOutlined />
      },
    ]
  },

  {
    title: 'ユーザー管理',
    key: '/user',
    icon: <UserOutlined />
  },
  {
    title: 'ロール管理',
    key: '/role',
    icon: <DesktopOutlined />
  },

  {
    title: '图形图表',
    key: '/charts',
    icon: <PictureOutlined />,
    children: [
      {
        title: '柱形图',
        key: '/charts/bar',
        icon: <BarChartOutlined />
      },
      {
        title: '折线图',
        key: '/charts/line',
        icon: <AreaChartOutlined />
      },
      {
        title: '饼图',
        key: '/charts/pie',
        icon: <PieChartOutlined />
      },
    ]
  },

  {
    title: '订单管理',
    key: '/order',
    icon: <DesktopOutlined />
  },
]

export default menuList
