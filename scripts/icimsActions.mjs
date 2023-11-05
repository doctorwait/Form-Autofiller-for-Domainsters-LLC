const icimsBtn = document.getElementById('icimsBtn');
icimsBtn.addEventListener('click', () => {
  chrome.tabs.query({ active: true }, function (tabs) {
    var tab = tabs[0];
    if (tab) {
      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id, allFrames: true },
          func: fillIcims,
        },
        onResult
      );
    } else {
      alert('There are no active tabs');
    }
  });
});

const fillIcims = function () {
  function value(selector, value) {
    document.getElementById(selector).value = value;
  }
  function click(selector) {
    document.getElementById(selector).click();
  }
  function dropdown(selector, ID) {
    const list = document.getElementById(selector);
    list.value = ID;
    const event = new Event('change', { bubbles: true });
    list.dispatchEvent(event);
  }

  chrome.runtime.sendMessage(
    { contentScriptQuery: 'loadJSON' },
    async function (data) {
      async function wait(sec = 1) {
        return new Promise(resolve => setTimeout(resolve, sec * 1000));
      }

      const runs = [
        [value, 'email', data.email],
        [click, 'enterEmailSubmitButton'],
        [value, 'PersonProfileFields.Login', data.login],
        [value, 'PersonProfileFields.Password', data.password],
        [value, 'PersonProfileFields.Password_Confirm', data.password],
        [value, 'PersonProfileFields.FirstName', data.firstName],
        [value, 'PersonProfileFields.LastName', data.lastName],
        [dropdown, '-1_PersonProfileFields.PhoneType', '15757'],
        [value, '-1_PersonProfileFields.PhoneNumber', data.phoneNumber],
        [dropdown, '-1_PersonProfileFields.AddressType', '15763'],
        [value, '-1_PersonProfileFields.AddressStreet1', data.street],
        [value, '-1_PersonProfileFields.AddressCity', data.city],
        [value, '-1_PersonProfileFields.AddressZip', data.postalCode],
        [
          dropdown,
          '-1_PersonProfileFields.AddressCountry_icimsDropdown',
          '12781',
        ],
        [dropdown, 'rcf3048', data.vacancySource],
        [dropdown, 'rcf3049', data.vacancySourceSpecified],
      ];

      for (const run of runs) {
        try {
          run[0](...run.slice(1));
        } catch (error) {
          console.error('Ошибка в функции: ' + error);
        }
      }
    }
  );
};

const onResult = function (frames) {
  window.close();
};
