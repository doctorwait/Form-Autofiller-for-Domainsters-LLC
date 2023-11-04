chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.contentScriptQuery === 'loadJSON') {
    fetch(chrome.runtime.getURL('data/userData.json'))
      .then(response => response.json())
      .then(data => {
        sendResponse(data); // Отправляем данные в основной скрипт
      })
      .catch(error => {
        console.error('Ошибка при загрузке JSON-файла:', error);
      });
    return true; // Важно вернуть true, чтобы сообщение обработалось асинхронно
  }
});
