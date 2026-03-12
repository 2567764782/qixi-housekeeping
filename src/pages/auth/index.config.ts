export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '' })
  : { navigationBarTitleText: '' }
