export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '分享推荐' })
  : { navigationBarTitleText: '分享推荐' }
