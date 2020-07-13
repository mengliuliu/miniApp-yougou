// pages/collect/collect.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      { index: 0, value: "商品收藏", isActive: true },
      { index: 1, value: "品牌收藏", isActive: false },
      { index: 2, value: "店铺收藏", isActive: false },
      { index: 3, value: "浏览足迹", isActive: false },
    ],
    collect: [],
  },
  onShow: function () {
    const collect = wx.getStorageSync("collect") || [];
    this.setData({ collect });
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
});
