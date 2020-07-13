import request from "../../request/request.js";
import {showToast} from "../../utils/asyncWX"
/* 
1. 发送请求，获取数据
2. 点击图片，进行预览
  1. 给轮播图绑定点击事件
  2. 调用小程序的api，previewImage
3. 点击加入购物车
  1. 先绑定点击事件
  2. 获取缓存中的购物车数据 数组格式
  3. 先判断当前的商品是否已经存在于购物车
  4. 已经存在修改商品数据，执行购物车数量++，重新把购物车数组填充回缓存中
  5. 不存在于购物车的数组中，直接给购物车数组添加一个新元素，新元素带上购买数量属性 num
  6. 重新填回缓存中
  7. 弹出提示
4. 商品收藏
  1. 页面 onShow 的时候，加载缓存中的商品收藏的数据
  2. 判断当前页面是不是被收藏
    1. 是 改变页面图标
    2. 不是 。。。
  3. 点击商品收藏按钮
    1. 判断该商品是否存在于缓存数组中
    2. 已经存在 把该商品删除
    3. 没有存在，把商品添加到收藏数组中，存入到缓存中即可
*/

Page({
  /**
   * 页面的初始数据
   */
  data: {
    goodDetailObj: {},
    isCollect: false,
  },
  goodInfo: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    const pages = getCurrentPages();
    const options = pages[pages.length - 1].options;
    console.log("options", options);

    const goods_id = options.goods_id;
    this.getGoodDetail(goods_id);
  },
  // 处理收藏按钮的点击
  handleCollectClick() {
    let isCollect = false;
    // 1. 从缓存中取出收藏数组
    const collect = wx.getStorageSync("collect") || [];
    // 2. 判断商品时候在收藏数组中
    const index = collect.findIndex(
      (v) => v.goods_id === this.goodInfo.goods_id
    );
    if (index !== -1) {
      // 3. 商品在收藏数组中
      collect.splice(index, 1);
      isCollect = false;
      showToast("取消成功")
    } else {
      // 4. 商品不存在收藏数组中
      collect.push(this.goodInfo);
      isCollect = true;
      showToast("收藏成功")
    }
    // 5. 把收藏数组存入到缓存中
    wx.setStorageSync("collect", collect);
    this.setData({
      isCollect,
    });
  },
  // 获取商品详情的函数
  async getGoodDetail(goods_id) {
    let { data: res } = await request({
      url: "/goods/detail",
      data: { goods_id },
    });
    res = res.message;

    // 取出商品信息
    this.goodInfo = res;

    console.log(res);

    // 加载缓存中的商品收藏数据
    const collect = wx.getStorageSync("collect") || [];
    // 判断该商品是否存在于缓存中
    let isCollect = collect.some(
      (v) => v.goods_id === this.goodInfo.goods_id
    );

    this.setData({
      goodDetailObj: {
        goods_name: res.goods_name,
        goods_price: res.goods_price,
        goods_introduce: res.goods_introduce,
        pics: res.pics,
        goods_id: res.goods_id,
      },
      isCollect,
    });
  },
  // 轮播图的点击事件
  handleImgClick(options) {
    const current = options.currentTarget.dataset.url;
    const urls = this.data.goodDetailObj.pics.map((v) => v.pics_mid);
    wx.previewImage({
      current,
      urls,
    });
  },
  // 点击加入购物车按钮
  // 1. 点击加入购物车按钮
  handleAddCar() {
    // 2. 获取缓存中数据
    let cart = wx.getStorageSync("cart") || [];
    // 3. 判断当前商品是否在购物车（缓存）中
    const index = cart.findIndex((v) => v.goods_id === this.goodInfo.goods_id);
    if (index === -1) {
      // 4. 如果不在，给商品信息对象添加num属性，并置为1
      this.goodInfo.num = 1;
      // 给商品添加选中属性
      this.goodInfo.checked = true;
      cart.push(this.goodInfo);
    } else {
      // 5. 已经存在，则把商品信息对象的数量加1
      cart[index].num++;
    }
    // 6. 把商品信息放入缓存中
    wx.setStorageSync("cart", cart);
    // 7. 弹窗提示
    wx.showToast({
      title: "加入购物车成功",
      icon: "success",
      // 防止用户手抖，连续点击
      mask: true,
    });
  },
});
