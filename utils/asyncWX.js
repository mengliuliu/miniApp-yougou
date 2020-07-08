export const getSetting = () => {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: (result) => {
        resolve(result);
        console.log(result);
      },
    });
  });
};

export const openSetting = () => {
  return new Promise((resolve, reject) => {
    wx.openSetting({
      success: (result) => {
        resolve(result);
        console.log(result);
      },
    });
  });
};

export const chooseAddress = () => {
  return new Promise((resolve, reject) => {
    wx.chooseAddress({
      success: (result) => {
        resolve(result);
        console.log(result);
      },
    });
  });
};

export const showModal = (content) => {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title: "提示",
      content: content,
      success: (res) => {
        resolve(res);
      },
    });
  });
};

export const showToast = (title) => {
  return new Promise((resolve, reject) => {
    wx.showToast({
      title: title,
      icon: "none",
      success: (res) => {
        resolve(res);
      },
    });
  });
};
