export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '首页',
      enablePullDownRefresh: true,
      backgroundTextStyle: 'dark'
    })
  : {
      navigationBarTitleText: '首页',
      enablePullDownRefresh: true,
      backgroundTextStyle: 'dark'
    }
