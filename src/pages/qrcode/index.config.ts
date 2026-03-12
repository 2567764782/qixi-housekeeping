export default typeof definePageConfig === 'function'
  ? definePageConfig({
    navigationBarTitleText: '扫码入群',
    navigationStyle: 'custom'
  })
  : {
    navigationBarTitleText: '扫码入群',
    navigationStyle: 'custom'
  }
