export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '实时通信' })
  : { navigationBarTitleText: '实时通信' }
