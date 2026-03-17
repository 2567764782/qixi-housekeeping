export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '包年会员',
    })
  : {
      navigationBarTitleText: '包年会员',
    }
