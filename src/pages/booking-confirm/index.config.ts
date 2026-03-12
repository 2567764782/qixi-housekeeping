export default typeof definePageConfig === 'function'
  ? definePageConfig({
    navigationBarTitleText: '预约挂号',
    navigationStyle: 'custom'
  })
  : {
    navigationBarTitleText: '预约挂号',
    navigationStyle: 'custom'
  }
