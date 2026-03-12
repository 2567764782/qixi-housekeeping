export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '服务预约' })
  : { navigationBarTitleText: '服务预约' }
