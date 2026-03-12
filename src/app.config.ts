export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/booking/index',
    'pages/orders/index',
    'pages/profile/index',
    'pages/auth/index',
    'pages/service-detail/index',
    'pages/about/index',
    'pages/terms/index',
    'pages/privacy/index',
    'pages/admin/index',
    'pages/booking-success/index',
    'pages/my-card/index',
    'pages/recent-activities/index',
    'pages/activity-detail/index',
    'pages/my-registrations/index',
    'pages/activity-notifications/index',
    'pages/qrcode/index',
    'pages/registration/index',
    'pages/hospital-detail/index',
    'pages/booking-confirm/index',
    'pages/create-cleaning-order/index',
    'pages/cleaner-management/index',
    'pages/order-review/index',
    'pages/cleaner-orders/index',
    'pages/statistics/index',
    'pages/payment/index',
    'pages/realtime/index',
    'pages/roles/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '保洁服务',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#999999',
    selectedColor: '#10B981',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '服务大厅',
        iconPath: './assets/tabbar/home.png',
        selectedIconPath: './assets/tabbar/home-active.png',
      },
      {
        pagePath: 'pages/orders/index',
        text: '订单',
        iconPath: './assets/tabbar/clipboard-list.png',
        selectedIconPath: './assets/tabbar/clipboard-list-active.png',
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的',
        iconPath: './assets/tabbar/user.png',
        selectedIconPath: './assets/tabbar/user-active.png',
      }
    ]
  }
})
