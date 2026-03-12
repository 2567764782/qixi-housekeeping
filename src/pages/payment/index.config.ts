export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '支付管理' })
  : { navigationBarTitleText: '支付管理' }
