export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '订阅服务',
    })
  : {
      navigationBarTitleText: '订阅服务',
    }
