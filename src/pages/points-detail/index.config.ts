export default typeof definePageConfig === 'function'
  ? definePageConfig({ 
    navigationBarTitleText: '积分明细',
    enablePullDownRefresh: true
  })
  : { 
    navigationBarTitleText: '积分明细',
    enablePullDownRefresh: true
  }
