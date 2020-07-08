// components/Tabs/Tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleTabClick(e) {
      // 获取 tabs 点击的索引
      const index = e.currentTarget.dataset.index
      console.log(index)

      // 发送事件给父组件，并且把索引传递过去
      this.triggerEvent("tabClick", index)
    }
  }
})
