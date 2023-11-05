const myWorkdayJobsBtn = document.getElementById('myWorkdayJobsBtn');
myWorkdayJobsBtn.addEventListener('click', () => {
  chrome.tabs.query({ active: true }, function (tabs) {
    var tab = tabs[0];
    if (tab) {
      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id, allFrames: true },
          func: fillMyWorkdayJob,
        },
        onResult
      );
    } else {
      alert('There are no active tabs');
    }
  });
});

const fillMyWorkdayJob = function () {
  /* Найти по XPath и кликнуть или положить значение.**/
  function xPath(xpathExpression, value = '') {
    const resultType = XPathResult.FIRST_ORDERED_NODE_TYPE;
    const xpathResult = document.evaluate(
      xpathExpression,
      document,
      null,
      resultType,
      null
    );
    const element = xpathResult.singleNodeValue;

    if (element) {
      if (value != '') {
        element.value = value;
        element.dispatchEvent(new Event('input', { bubbles: true }));
      } else {
        element.click();
      }
    } else {
      console.error("I'm so stupid to find that: " + xpathExpression);
    }
  }

  function value(selector, value) {
    const elem = document.getElementById(selector);
    elem.value = value;
    return elem;
  }
  function click(selector) {
    const elem = document.getElementById(selector);
    elem.click();
    return elem;
  }
  function pressEnter(elem) {
    const event = new KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      which: 13,
      keyCode: 13,
      charCode: 13,
      keyCodeVal: 13,
      charCodeVal: 13,
      bubbles: true,
      cancelable: true,
      composed: true,
    });
    if (elem) {
      elem.dispatchEvent(event);
    } else {
      document.dispatchEvent(event);
    }
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
      // Некоторые элементы в списке сделаны пакетом инструкций...
      const runs = [
        [click, 'input-1'],
        [wait, 2],
        [xPath, '//div[@data-automation-label="Corporate Website"]'],
        [wait, 2],
        [xPath, '//div[@data-automation-label="Company Career Site"]'],
        [xPath, '//input[@data-uxi-element-id="radio_2"]'],
        [xPath, '//button[@data-automation-id="countryDropdown"]'],
        [xPath, '//div[text()="United States of America"]'],
        [
          xPath,
          '//input[@data-automation-id="legalNameSection_firstName"]',
          data.firstName,
        ],
        [xPath, '//input[@data-automation-id="legalNameSection_firstName"]'],
        [
          xPath,
          '//input[@data-automation-id="legalNameSection_lastName"]',
          data.lastName,
        ],
        [xPath, '//input[@data-automation-id="legalNameSection_lastName"]'],
        [
          xPath,
          '//input[@data-automation-id="addressSection_addressLine1"]',
          data.street,
        ],
        [xPath, '//input[@data-automation-id="addressSection_addressLine1"]'],
        [
          xPath,
          '//input[@data-automation-id="addressSection_city"]',
          data.city,
        ],
        [xPath, '//input[@data-automation-id="addressSection_city"]'],
        [xPath, '//button[@data-automation-id="addressSection_countryRegion"]'],
        [xPath, '//div[text()="Kansas"]'],
        [
          xPath,
          '//input[@data-automation-id="addressSection_postalCode"]',
          data.postalCode,
        ],
        [
          xPath,
          '//input[@data-automation-id="addressSection_postalCode"]'
        ],
        [
          xPath,
          '//input[@data-automation-id="addressSection_regionSubdivision1"]',
          data.country,
        ],
        [
          xPath,
          '//input[@data-automation-id="phone-number"]',
          data.phoneNumber,
        ],
        [
          xPath,
          '//input[@data-automation-id="phone-number"]'
        ],
        [
          xPath,
          '//button[@data-automation-id="bottom-navigation-next-button"]',
        ],
      ];

      for (const run of runs) {
        try {
          await run[0](...run.slice(1));
        } catch (error) {
          console.error('Error in custom function: ' + error);
        }
      }
    }
  );
};
