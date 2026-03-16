export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '新闻详情',
      navigationStyle: 'custom'
    })
  : {
      navigationBarTitleText: '新闻详情',
      navigationStyle: 'custom'
    }
