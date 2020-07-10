import { login } from "../../utils/asyncWX";
import { request } from "../../request/request";
Page({
  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  // 点击授权获取用户信息
  async handleAuthClick(e) {
    console.log(e);
    // 1. 获取用户信息
    const { encryptedData, rawData, iv, signature } = e.detail;
    // 2. 获取小程序登录成功后的code
    const { code } = await login();
    const paramsData = { encryptedData, rawData, iv, signature, code };
    console.log(paramsData);
    // 3. 发送请求 获取用户的token
    const { token } = await request({
      url: "/users/wxlogin",
      method: "POST",
      data: paramsData,
    });
    console.log("token", token);
    // 4. 把token存入缓存中，同时跳转回上一个页面
  },
});
