export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '联系我们' })
  : { navigationBarTitleText: '联系我们' }
