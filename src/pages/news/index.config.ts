export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '实时新闻'
    })
  : { navigationBarTitleText: '实时新闻' }
