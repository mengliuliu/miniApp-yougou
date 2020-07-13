import request from "../../request/request";
//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    // 轮播图数据
    swiperList: [],
    // 导航菜单数据
    cateList: [],
    // 楼层数据
    floorList: [],
  },
  onLoad: function () {
    // 调用轮播图的接口获取数据
    this.getSwiperData();
    // 调用导航菜单的接口获取数据
    this.getCateData();
    // 调用楼层的接口获取数据
    this.getFloorData();
  },
  getSwiperData() {
    request({
      url: "/home/swiperdata",
    }).then((res) => {
      console.log(res);
      let swiperList = res.data.message;
      swiperList.forEach((v) => {
        v.navigator_url = v.navigator_url.replace(/main/, "goods_detail");
      });
      this.setData({
        swiperList,
      });
    });
  },
  getCateData() {
    request({
      url: "/home/catitems",
    }).then((res) => {
      console.log(res);
      this.setData({
        cateList: res.data.message,
      });
    });
  },
  getFloorData() {
    request({
      url: "/home/floordata",
    }).then((res) => {
      console.log(res);
      let floorList = res.data.message;

      floorList.forEach((v) => {
        v.product_list.forEach((v1) => {
          v1.navigator_url = v1.navigator_url.replace(
            /goods_list/,
            "goods_list/goods_list"
          );
        });
      });

      this.setData({
        floorList,
      });
    });
  },
});
