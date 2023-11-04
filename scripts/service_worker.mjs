const userData = 'data/userData.json';
const resumeURL = '../data/log.txt';

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.contentScriptQuery === 'loadJSON') {
    fetch(chrome.runtime.getURL(userData))
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

// TODO: доработать загрузку файлов.
chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  if (request.contentScriptQuery === 'loadResume') {
    try {
      const response = await fetch(chrome.runtime.getURL('../data/log.txt'));
      const data = await response.blob();
      const resultFile = await new File([data], 'log.txt', {
        type: 'text/plain',
      });
      await sendResponse(resultFile);
    } catch (error) {
      console.error('Ошибка при загрузке файла', error);
    }
    return true; // Важно вернуть true, чтобы сообщение обработалось асинхронно
  }
});
