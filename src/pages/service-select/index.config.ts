export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '服务选择' })
  : { navigationBarTitleText: '服务选择' }
