export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '在线客服',
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTextStyle: 'black'
    })
  : {
      navigationBarTitleText: '在线客服',
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTextStyle: 'black'
    }
