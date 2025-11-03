chrome.action.onClicked.addListener(() => {
  chrome.windows.create({
    url: "popup.html",
    type: "popup",
    width: 560,  
    height: 720, 
    top: 100,
    left: 180
  });
});
