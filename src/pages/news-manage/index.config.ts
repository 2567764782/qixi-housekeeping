export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '新闻管理',
    })
  : {
      navigationBarTitleText: '新闻管理',
    }
