/* 
1. 输入框绑定 值改变事件 input事件
  1. 获取到输入框的值
  2. 合法性判断
  3. 检验通过，把输入框的值发送到后台
  4. 返回的数据打印到页面上
2. 防抖（防止抖动）定时器 节流
  0. 防抖 一般输入框中防止重复输入，重复发送请求
  1. 节流 一般是用在页面下拉和上拉
  2. 定义全局的定时器id
*/
import request from "../../request/request";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    goods: [],
    // 控制取消按钮的显示与隐藏
    isHidden: true,
    inpValue: "",
  },
  timeId: -1,
  // 处理输入框值的改变
  handleInputChange(e) {
    // console.log(e);
    // 1. 获取输入框的值
    const { value } = e.detail;
    // 2. 合法性判断
    if (!value.trim()) {
      console.log("输入的值不合法，请重新输入");
      this.setData({
        isHidden: true,
        goods: [],
      });
      return;
    }
    // 3. 检验通过发送给后台
    // 校验通过显示按钮
    this.setData({
      isHidden: false,
    });
    // 清楚定时器
    clearTimeout(this.timeId);
    this.timeId = setTimeout(() => {
      this.qsearch(value);
    }, 1000);
  },
  // 取消按钮的点击
  handleCancel() {
    this.setData({
      inpValue: "",
      isHidden: true,
      goods: [],
    });
  },
  async qsearch(value) {
    const res = await request({
      url: "/goods/qsearch",
      data: { query: value },
    });
    console.log(res);
    this.setData({
      goods: res.data.message,
    });
  },
});
