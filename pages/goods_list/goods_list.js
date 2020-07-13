import request from "../../request/request";
Page({
  /**
   * 需求1. 用户上划页面，滚动条触底，开始加载下一页数据
   *    1. 找到滚动条触底事件
   *    2. 判断还有没有下一页数据
   *        1. 获取总页数（利用总条数）
   *        2. 获取当前页码值
   *        3. 判断一下 当前的页码值是否大于等于总页数
   *    3. 假如没有下一页数据，弹出一个提示
   *    4. 加入还有下一页数据，则加载下一页数据
   *        1. 当前的页码++
   *        2. 重新发送请求
   *        3. 数据请求回来，要对data中的数组进行 拼接 而不是全部替换
   * 需求2.
   *    1. 触发下拉刷新页面，需要在页面的json文件中开启一个配置项
   *    2. 重置数据数组
   *    3. 重置页码设置为1
   *    4. 重新发送请求
   *    5. 数据请求回来，需要手动的关闭，等待效果
   */
  data: {
    tabs: [
      { index: 0, value: "综合", isActive: true },
      { index: 1, value: "销量", isActive: false },
      { index: 2, value: "价格", isActive: false },
    ],
    goodList: [],
  },

  // 商品列表搜索参数
  QueryParams: {
    query: "",
    cid: "",
    pagenum: 1,
    pagesize: 10,
  },
  totalPage: 1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    // 给查询参数的cid赋值
    this.QueryParams.cid = options.cid || "";
    // 给查询参数的query赋值
    this.QueryParams.query = options.query || "";
    // 调用接口获取商品的数据
    this.getGoodData();
  },
  // ----------事件监听函数----------
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
  // ----------接口请求函数----------
  async getGoodData() {
    const res = await request({
      url: "/goods/search",
      data: this.QueryParams,
    });
    console.log(res);
    // 获取总数据条数
    const total = res.data.message.total;
    this.totalPage = Math.ceil(total / this.QueryParams.pagesize);
    // console.log(this.totalPage)

    this.setData({
      goodList: [...this.data.goodList, ...res.data.message.goods],
    });

    // 停止当前页面下拉刷新
    wx.stopPullDownRefresh();
  },

  // 监听用户上拉触底事件
  onReachBottom() {
    // 判断是否还有下一页
    if (this.QueryParams.pagenum >= this.totalPage) {
      wx.showToast({
        title: "没有下一页数据了",
      });
      console.log("没有下一页数据");
    } else {
      console.log("还有下一页数据");
      this.QueryParams.pagenum++;
      this.getGoodData();
    }
  },
  // 下拉刷新的生命周期函数
  onPullDownRefresh() {
    // 1. 重置数组
    this.setData({
      goodList: [],
    });
    // 2. 重置页码值
    this.QueryParams.pagenum = 1;
    // 3. 发送请求
    this.getGoodData();
  },
});
