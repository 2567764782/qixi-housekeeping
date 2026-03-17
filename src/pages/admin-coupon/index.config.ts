export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '优惠券管理',
    })
  : {
      navigationBarTitleText: '优惠券管理',
    }
