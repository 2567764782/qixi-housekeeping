export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '余额充值',
    })
  : {
      navigationBarTitleText: '余额充值',
    }
