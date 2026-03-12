export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '我的名片' })
  : { navigationBarTitleText: '我的名片' }
