export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '服务条款' })
  : { navigationBarTitleText: '服务条款' }
