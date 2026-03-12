export default typeof definePageConfig === 'function'
  ? definePageConfig({
    navigationBarTitleText: '发布保洁需求',
    navigationStyle: 'custom'
  })
  : {
    navigationBarTitleText: '发布保洁需求',
    navigationStyle: 'custom'
  }
