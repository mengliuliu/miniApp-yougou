import request from "../../request/request";
// import runtime from "../../lib/runtime/runtime";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 左侧菜单数据
    leftMenuList: [],
    // 右侧商品数据
    rightGoodList: [],
    // 左侧分类的激活
    currentIndex: 0,
    // 右侧滚动条的位置
    scrollTop: 0,
  },
  // 接口返回的分类数据
  cates: [],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /* 
    0. web中的本地存储和小程序中的本地存储的区别
        1. 写代码的方式不一样
          web: localStorage.setItem("key", "value")
        小程序: wx.setStorageSync("key", "value")
        2. 存的时候 有没有做类型转换
          web: 不管存入的是什么类型的数据，最终都会先调用 toString(), 把数据变成了字符串，再存入进去
        小程序: 不存在类型转换的这个操作，存什么类型的数据进去，获取的时候就是什么类型
    1. 先判断一下本地存储中有没有旧的数据
      {time: Date.now(), data: [...]}
    2. 没有旧数据 直接发送新请求
    3. 有旧的数据，同时旧的数据也没有过期，就使用本地存储中的旧数据即可

    */
    //  获取本地中存储的数据
    const cates = wx.getStorageSync("cates");
    if (!cates) {
      // 不存在 发送请求获取数据
      // 调用分类的接口获取数据
      this.getCateData();
    } else {
      // 定义过期时间为 10s
      if (Date.now() - cates.time > 10 * 1000) {
        this.getCateData();
      } else {
        // 使用旧的数据
        this.cates = cates.data;
        // 构造左侧的菜单数据
        const leftMenu = this.cates.map((v) => v.cat_name);
        // 构造右侧的商品数据
        const rightGood = this.cates[0].children;
        this.setData({
          leftMenuList: leftMenu,
          rightGoodList: rightGood,
        });
      }
    }
  },
  // getCateData() {
  //   request({
  //     url: "/categories",
  //   }).then((res) => {
  //     console.log(res);
  //     this.cates = res.data.message;
  //     // 将数据存储到本地
  //     wx.setStorageSync("cates", { time: Date.now(), data: this.cates });

  //     // 构造左侧的菜单数据
  //     const leftMenu = this.cates.map((v) => v.cat_name);
  //     // 构造右侧的商品数据
  //     const rightGood = this.cates[0].children;
  //     this.setData({
  //       leftMenuList: leftMenu,
  //       rightGoodList: rightGood,
  //     });
  //   });
  // },

  async getCateData() {
    const res = await request({
      url: "/categories",
    });
    console.log(res);
    this.cates = res.data.message;
    // 将数据存储到本地
    wx.setStorageSync("cates", { time: Date.now(), data: this.cates });

    // 构造左侧的菜单数据
    const leftMenu = this.cates.map((v) => v.cat_name);
    // 构造右侧的商品数据
    const rightGood = this.cates[0].children;
    this.setData({
      leftMenuList: leftMenu,
      rightGoodList: rightGood,
    });
  },

  // 处理分类页面左侧的点击，以便切换激活状态和右侧数据
  handleCateClick(options) {
    console.log(options);
    // 1. 拿到传递过来的index
    // 2. 更换激活状态
    // 3. 根据索引（index），更换右侧数据
    // 4. 更改data中的数据
    const index = options.currentTarget.dataset.index;
    const rightGood = this.cates[index].children;
    this.setData({
      currentIndex: index,
      rightGoodList: rightGood,
      // 设置右侧滚动条的位置
      scrollTop: 0,
    });
  },
});
