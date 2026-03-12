export default typeof definePageConfig === 'function'
  ? definePageConfig({
    navigationBarTitleText: '北京医院挂号',
    navigationBarBackgroundColor: '#10B981',
    navigationBarTextStyle: 'white'
  })
  : {
    navigationBarTitleText: '北京医院挂号',
    navigationBarBackgroundColor: '#10B981',
    navigationBarTextStyle: 'white'
  }
