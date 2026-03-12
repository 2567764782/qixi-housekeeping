export default typeof definePageConfig === 'function'
  ? definePageConfig({
    navigationBarTitleText: '医院详情',
    navigationStyle: 'custom'
  })
  : {
    navigationBarTitleText: '医院详情',
    navigationStyle: 'custom'
  }
