// components/UpImg/UpImg.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    src: {
      type: String,
      value: "",
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    // 处理图标被点击的函数
    handleIconClick() {
      console.log("图片组件的图标被点击了")
      this.triggerEvent("IconClick");
    },
  },
});
