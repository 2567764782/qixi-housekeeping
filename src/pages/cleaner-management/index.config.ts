export default typeof definePageConfig === 'function'
  ? definePageConfig({
    navigationBarTitleText: '保洁员管理'
  })
  : {
    navigationBarTitleText: '保洁员管理'
  }