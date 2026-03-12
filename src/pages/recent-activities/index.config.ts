export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '近期活动' })
  : { navigationBarTitleText: '近期活动' }
