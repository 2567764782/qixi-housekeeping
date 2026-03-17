export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '我的钱包' })
  : { navigationBarTitleText: '我的钱包' }
