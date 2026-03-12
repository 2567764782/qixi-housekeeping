export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '活动通知' })
  : { navigationBarTitleText: '活动通知' }
