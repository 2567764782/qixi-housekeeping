export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '订单支付'
    })
  : {
      navigationBarTitleText: '订单支付'
    }
