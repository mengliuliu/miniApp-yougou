import request from "../../request/request";
//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    // 轮播图数据
    swiperList: [],
    // 导航菜单数据
    cateList: [],
    // 楼层数据
    floorList: []
  },
  onLoad: function () {
    // 调用轮播图的接口获取数据
    this.getSwiperData()
    // 调用导航菜单的接口获取数据
    this.getCateData()
    // 调用楼层的接口获取数据
    this.getFloorData()
  },
  getSwiperData() {
    request({
      url: '/home/swiperdata',
    }).then(
      (res) => {
        console.log(res)
        this.setData({
          swiperList: res.data.message
        })
      }
    )
  },
  getCateData() {
    request({
      url: '/home/catitems',
    }).then(
      (res) => {
        console.log(res)
        this.setData({
          cateList: res.data.message
        })
      }
    )
  },
  getFloorData() {
    request({
      url: '/home/floordata',
    }).then(
      (res) => {
        console.log(res)
        this.setData({
          floorList: res.data.message
        })
      }
    )
  }
})
