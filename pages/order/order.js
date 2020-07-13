// pages/order/order.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      { index: 0, value: "全部", isActive: true },
      { index: 1, value: "待付款", isActive: false },
      { index: 2, value: "待发货", isActive: false },
      { index: 3, value: "退款/退货", isActive: false },
    ],
  },
  tabClick(options) {
    console.log(options);
    // 1. 获取子组件传递过来的索引
    const index = options.detail;
    // 2. 取出并修改源数组
    let tabs = this.data.tabs;
    tabs.forEach((v, i) =>
      i === index ? (v.isActive = true) : (v.isActive = false)
    );
    // 3. 赋值到 data 中
    this.setData({
      tabs,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
});
