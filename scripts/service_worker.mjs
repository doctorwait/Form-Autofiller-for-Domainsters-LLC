const userData = 'data/userData.json';

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.contentScriptQuery === 'loadJSON') {
    fetch(chrome.runtime.getURL(userData))
      .then(response => response.json())
      .then(data => {
        sendResponse(data);
      })
      .catch(error => {
        console.error('Ошибка при загрузке JSON-файла:', error);
      });
    return true;
  }
});
