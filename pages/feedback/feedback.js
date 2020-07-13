/* 
功能未完成
1. 点击 “+” 触发tap点击事件
  1. 调用小程序内置的选择图片的 API
  2. 获取到图片的路径数组
  3. 把图片路径存到data的变量中
  4. 页面就可以根据图片数组进行循环显示，自定义组件
2. 点击自定义图片组件
  1. 获取被点击的元素的索引
  2. 获取 data 中的图片数组
  3. 根据索引，数组中删除对应的元素
  4. 把数组重新设置回data中
3. 点击“提交”
  1. 获取文本域的内容，类似输入框的获取
    1. data 中定义变量，表示输入框内容
    2. 文本域绑定输入事件，事件触发的时候，把输入框的值存入到变量中
  2. 对这些内容合法性验证
  3. 验证通过，用户选择的图片，上传到专门的图片服务器，返回图片外网的链接
    1. 遍历图片数组
    2. 挨个上传
    3. 自己在维护图片数组，存放图片上传后的外网的链接
  4. 文本域和外网的图片地址，一起提交到服务器，前端的模拟，不会发送到后台
  5. 清空当前页面
  6. 返回上一页
*/
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      { index: 0, value: "体验问题", isActive: true },
      { index: 1, value: "商品、商家投诉", isActive: false },
    ],
    imgsList: [],
    textVal: "",
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
  // 添加图片按钮点击时触发
  handleAddImgClick() {
    wx.chooseImage({
      // 最多可以选择的图片张数
      count: 9,
      // 所选的图片的尺寸 原图，压缩图
      sizeType: ["original", "compressed"],
      // 选择图片的来源 相册，相机
      sourceType: ["album", "camera"],
      success: (res) => {
        console.log(res);
        this.setData({
          // 把新选中的图片添加到data数据中
          imgsList: [...this.data.imgsList, ...res.tempFilePaths],
        });
      },
    });
  },
  // 处理删除图标被点击
  handleIconClick(e) {
    console.log(e);
    // 取索引
    const { index } = e.currentTarget.dataset;
    // 获取图片数组
    let imgsList = this.data.imgsList;
    // 根据索引删除图片
    imgsList.splice(index, 1);
    // 将删除后的数组重新放回data中
    this.setData({ imgsList });
  },
  // 处理文本域的输入
  handleTextInput(e) {
    // 1. 获取文本域中的内容，然后存放到data中
    console.log(e);
    let textVal = e.detail.value;
    this.setData({
      textVal,
    });
  },
  // 处理表单提交
  handleFormSubmit() {
    // 2. 对内容合法检验
    if (!this.data.textVal.trim()) {
      // 此时输入的内容不合法
      wx.showToast({
        title: "输入的内容不合法",
        icon: "none",
      });
      return;
    }
    // 3. 检验通过
    this.data.imgsList.forEach((v, i) => {
      // 遍历图片数组 挨个上传图片
      // 接口失效
      wx.uploadFile({
        url: "https://images.ac.cn/Home/Index/UploadAction/",
        filePath: v,
        name: "file",
        success: (res) => {
          console.log("图片上传后的链接", res);
        },
      });
    });
    // 将文本和外网图片地址，一起发送都后台
    console.log("文本和外网图片地址发送至后台成功");
    // 清空当前页面
    this.setData({
      imgsList: [],
      textVal: "",
    });
    // 返回上一层
    wx.navigateBack({
      delta: 1,
    });
  },
});
