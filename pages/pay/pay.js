/* 
1. 页面加载的时候
  1. 从缓存中获取购物车数据，渲染到页面中
    这些数据的 checked = true
2. 微信支付
  1. 哪些人 哪些账号 可以实现微信支付
  2. 企业账号的小程序后台中，必须给开发者添加白名单
    1. 一个 appid 可以同时绑定多个开发者
    2. 这些开发者就可以公用这个 appid 和它的开发权限
3. 支付按钮
  1. 先判断缓存中有没有token
  2. 没有，跳转到授权页面，进行获取token
  3. 有token。。。
*/

import {
  chooseAddress,
  openSetting,
  getSetting,
  showModal,
  showToast,
} from "../../utils/asyncWX";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  onShow: function () {
    // 获取本地存储的地址数据
    let address = wx.getStorageSync("address") || {};

    let cart = wx.getStorageSync("cart") || [];

    // 过滤选中的购物车数据
    cart = cart.filter((v) => v.checked);

    let totalPrice = 0;
    let totalNum = 0;

    cart.forEach((element) => {
      totalNum += element.num;
      totalPrice += element.num * element.goods_price;
    });

    this.setData({
      cart,
      address,
      totalNum,
      totalPrice,
    });
  },
  // 支付按钮的点击
  handleGoodsPay() {
    // 1. 判断缓存中有没有token
    const token = wx.getStorageSync("token");
    // 2. 没有则跳转到页面授权，进行获取token
    if (!token) {
      wx.navigateTo({
        url: "../auth/auth",
      });
      return;
    }
    console.log("token已经存在");
  },
});
