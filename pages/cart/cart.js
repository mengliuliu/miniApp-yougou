/* 
1. 获取用户的收货地址
  1. 绑定点击事件
  2. 调用小程序内置API 获取用户的收获地址
  2. 获取用户对小程序所授予获取地址的权限状态 scope
    1. 假设用户点击获取收货地址的提示框 确定 authSetting.scope.address
      scope 值 true 直接调用获取收货地址
    2. 假设用户从来没有调用过 收货地址的api
      scope 值 undefined 直接调用获取收货地址
    3. 假设用户点击获取收货地址的提示框 取消 authSetting.scope.address
      scope 值 false 
      1. 诱导用户自己打开授权设置页面（wx.openSetting) 当用户重新给与获取地址权限的时候
      2. 获取收货地址
2. 页面加载完毕
  0. onLoad  onShow
  1. 获取本地存储中的地址数据
  2. 把数据设置给data中的一个变量
3. onShow
  0. 回到了商品详情页面，第一次添加商品的时候，手动添加了属性
    1. num=1;
    2. checked=true;
  1. 获取缓存中的购物车数组
  2. 把购物车数据填充到 data 中
4. 全选的实现，数据的展示
  1. onShow 获取缓存中的购物车数组
  2. 根据购物车中的商品数据，所有的商品都被选中 checked=true 全选就被选中
5. 总价格和总数量
  1. 都需要商品被选中，我们才拿它来计算
  2. 获取购物车数组
  3. 遍历
  4. 判断商品是否被选中
  5. 总价格 += 商品的单价 * 商品的数量
  6. 把计算后的价格和数量设置回data 中即可
6. 商品的选中
  1. 绑定 change 事件
  2. 获取到被修改的商品对象
  3. 商品对象的选中状态取反
  4. 重新填充回data中和缓存中
  5. 重新计算全选，总价格，总数量
7. 全选和反选
  1. 全选复选框绑定事件 change
  2. 获取 data 中的全选变量 allChecked
  3. 直接取反 allChecked=!allChecked
  4. 遍历购物车数组，让里面商品选中状态跟随 allChecked 改变而改变
  5. 把购物车数组 和 allChecked 重新设置回 data 把购物车重新设置回缓存中
8. 商品数量的编辑
  1. "+" "-" 按钮绑定同一个点击事件，区分的关键，自定义属性
    1. "+" "+1"
    2. "-" "-1"
  2. 传递被点击的商品id goods_id
  3. 获取data中的购物车数组，来获取需要被修改的商品对象
  4. 当购物车的数量 =1 同时用户点击了 "-"
    弹窗提示（showModal）询问用户是否要删除
    1. 确定 直接执行删除
    2. 取消 什么都不做
  4. 直接修改商品对象的数量
  5. 把 cart 数组重新社会回缓存中和data中 this.setCart()
9. 点击结算
  1. 判断有没有收货地址
  2. 判断用户有没有选购商品
  3. 经过以上的验证，则跳转到支付页面
*/
import {
  chooseAddress,
  openSetting,
  getSetting,
  showModal,
  showToast,
} from "../../utils/asyncWX";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  onShow: function () {
    // 获取本地存储的地址数据
    let address = wx.getStorageSync("address") || {};

    let cart = wx.getStorageSync("cart") || [];

    this.setData({
      address,
    });

    // 获取本地存储的购物车数据
    this.setCart(cart);
  },
  // 点击收货地址
  async handldChooseAddress() {
    // 获取收货地址
    // wx.chooseAddress({
    //   success: (result) => {
    //     console.log(result)
    //   }
    // })
    // 获取用户的当前设置
    /*
    wx.getSetting({
      success: (result) => {
        // 获取权限状态 主要发现一些属性名很怪异的时候
        console.log(result);
        if (
          // 注意：当有属性比较特别时，要用中括号加引号的方式获取属性
          result.authSetting["scope.address"] === true ||
          result.authSetting["scope.address"] === undefined
        ) {
          // 直接获取收货地址
          wx.chooseAddress({
            success: (result1) => {
              console.log(result1);
            },
          });
        } else {
          // 诱导用户自己打开授权设置界面
          wx.openSetting({
            success: (result2) => {
              // 用户打开授权设置页面后，在获取收货地址
              wx.chooseAddress({
                success: (result3) => {
                  console.log(result3);
                },
              });
            },
          });
        }
      },
    });
    */

    /*// 获取用户的当前设置
    const res = await getSetting();
    // console.log(res)
    // 得到
    const result = res.authSetting["scope.address"];
    if (result === true || result === undefined) {
      // 直接获取收货地址
      const address = await chooseAddress();
      console.log(address);
    } else {
      // 诱导用户自己打开授权设置界面
      openSetting();
      const address = await chooseAddress();
      console.log(address);
    }
    */
    try {
      // 1. 获取权限状态
      const res1 = await getSetting();
      console.log("res1", res1);
      const scopeAddress = res1.authSetting["scope.address"];
      // 2. 判断权限状态
      if (scopeAddress === false) {
        await openSetting();
      }
      // 3. 调用获取收货地址的api
      const address = await chooseAddress();

      // all属性为详细地址
      address.all =
        address.provinceName +
        address.cityName +
        address.countyName +
        address.detailInfo;

      console.log(address);
      // 4. 存入到缓存中
      wx.setStorageSync("address", address);
    } catch (err) {
      console.log(err);
    }
  },
  // 处理商品复选框的变化
  handleCheckoutChange(options) {
    const goods_id = options.currentTarget.dataset.goods_id;
    console.log(goods_id);
    // 获取到被修改的商品对象
    let cart = wx.getStorageSync("cart");
    let index = cart.findIndex((v) => v.goods_id === goods_id);
    // 状态取反
    cart[index].checked = !cart[index].checked;
    // 重新填回data 和 缓存中
    this.setData({
      cart,
    });
    wx.setStorageSync("cart", cart);
    // 重新计算全选 总价格 总数量
    this.setCart(cart);
  },
  // 处理全选复选框的变化
  handleAllcheckedChange() {
    // 取状态
    let { cart, allChecked } = this.data;
    // 取反
    allChecked = !allChecked;
    // 遍历购物车数组，改变商品的选中状态
    cart.forEach((v) => (v.checked = allChecked));
    // 把allChecked 和 cart重新置回data中，并把购物车设置回缓存
    this.setCart(cart);
  },
  // 处理加减按钮的点击
  async handleItemNumEdit(options) {
    // 1. 取出传递过来的 商品id 和 运算符
    console.log(options);
    let { id, op } = options.currentTarget.dataset;
    // 2. 取出data中的 购物车数组
    let { cart } = this.data;

    // 3. 查找当前点击商品的索引
    let index = cart.findIndex((v) => v.goods_id === id);

    // 4. 判断是否确定删除
    if (cart[index].num === 1 && op === -1) {
      // 弹窗提示，是否要删除
      // wx.showModal({
      //   title: "提示",
      //   content: "是否要删除该商品数据",
      //   success: (res) => {
      //     if (res.confirm) {
      //       console.log("用户点击确定");
      //       cart.splice(index, 1);
      //       this.setCart(cart);
      //     } else if (res.cancel) {
      //       console.log("用户点击取消");
      //     }
      //   },
      // });
      const res = await showModal("是否删除该商品");
      if (res.confirm) {
        console.log("用户点击确定");
        cart.splice(index, 1);
        this.setCart(cart);
      }
    } else {
      // 4. 修改数量
      cart[index].num += op;
      // 5. 把cart数组重新设置回缓存中和data中
      this.setCart(cart);
    }
  },
  // 处理结算按钮的点击
  async handlePay() {
    const { address, totalNum } = this.data;
    // 1. 判断有没有收货地址
    if (!address.userName) {
      await showToast("您还没有添加收货地址");
      return;
    }
    // 2. 判断用户有没有选购商品
    if (!totalNum) {
      await showToast("您还没有添加商品");
      return;
    }
    // 3. 跳转至支付页面
    wx.navigateTo({
      url: "../pay/pay",
      success: function (res) {
        console.log("跳转成功", res);
      },
    });
  },
  // 设置购物车状态同时，重新计算底部工具栏的数据 全选 总价格 购买的数量
  setCart(cart) {
    /* 
      计算全选
      every 数组方法会遍历会接收一个回调函数，那么每一个回调函数都返回 true 则 every 方法
      的返回值才为 true 
      空数组调用 every ，返回值就是true
    */
    // const allChecked = cart.length ? cart.every((v) => v.checked) : false;

    let totalPrice = 0;
    let totalNum = 0;
    let allChecked = true;

    cart.forEach((element) => {
      if (element.checked) {
        // 如果商品被选中
        totalNum += element.num;
        totalPrice += element.num * element.goods_price;
      } else {
        // 如果有一个商品没被选中，则全选未被选中
        allChecked = false;
      }
    });

    // 如果数组为空，则全选未被选中
    cart.length === 0 ? (allChecked = false) : "";

    // 把数据设置给 data 中的变量
    this.setData({
      cart,
      allChecked,
      totalNum,
      totalPrice,
    });
    wx.setStorageSync("cart", cart);
  },
});
