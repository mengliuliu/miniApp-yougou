export default function (options) {
  wx.showLoading({
    title: "加载中",
  });


  // 定义公共的URL
  const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1";
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseUrl + options.url,
      method: options.method || "GET",
      data: options.data || null,
      success: function (res) {
        resolve(res);
      },
      fail: function (err) {
        reject(err);
      },
      complete: function () {
        wx.hideLoading();
      },
    });
  });
}
