export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '热点新闻',
      enablePullDownRefresh: true,
    })
  : {
      navigationBarTitleText: '热点新闻',
      enablePullDownRefresh: true,
    }
