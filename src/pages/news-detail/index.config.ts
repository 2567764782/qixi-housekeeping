export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '新闻详情'
    })
  : {
      navigationBarTitleText: '新闻详情'
    }
