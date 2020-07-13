// pages/login/login.js
Page({
  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  // 处理用户信息
  handleGetUserInfo(e) {
    console.log(e);
    const { userInfo } = e.detail;
    // 把用户信息存入缓存中
    wx.setStorageSync("userInfo", userInfo);
    // 返回到上一级页面
    wx.navigateBack({
      delta: 1,
    });
  },
});
