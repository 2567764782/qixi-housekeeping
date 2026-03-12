export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '我的报名' })
  : { navigationBarTitleText: '我的报名' }
