export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/news/index',
    'pages/news-detail/index',
    'pages/webview/index',
    'pages/login/index',
    'pages/booking/index',
    'pages/orders/index',
    'pages/profile/index',
    'pages/settings/index',
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
    'pages/roles/index',
    'pages/customer-service/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '柒玺家政',
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
        text: '首页',
        iconPath: './assets/tabbar/house.png',
        selectedIconPath: './assets/tabbar/house-active.png',
      },
      {
        pagePath: 'pages/booking/index',
        text: '服务预约',
        iconPath: './assets/tabbar/calendar.png',
        selectedIconPath: './assets/tabbar/calendar-active.png',
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
