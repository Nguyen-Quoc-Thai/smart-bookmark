/** ----------------------------- Util ---------------------------*/
function genId(length) {
  const characters = 'abc0123456789';
  const charactersLength = characters.length;

  let result = '';

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

/** ----------------------------- Handler ---------------------------*/
const BASE_API_URL = 'https://600e379f3bb1d100179de841.mockapi.io/api/v1';

const keys = [
  'browserSearch',
  'color',
  'converter',
  'codeEditor',
  'codeOptimize',
  'dataGenerator',
  'other'
];

// Render popup & add listener
(() => {
  fetch(`${BASE_API_URL}/tools`)
    .then((response) => response.json())
    .then((store) => {
      keys.forEach((key) => {
        const items = store.filter((el) => el.type === key);

        if (!items.length) return;

        let result = '';

        items.map((resource) => {
          result += `
          <div class="item">
            <button type="button" class="btn btn-light btn-sm" src=${resource.link} id="${resource.id}">
              <img class="icon" src=${resource.icon} alt=${resource.name} style="width: 18px; height: 18px;"/>
              <span class="name">${resource.name}</span>
            </button>
            <div class="btn-del"><span></span></div>
          </div>
        `;
        });

        document.getElementById(`${key}-list`).innerHTML = result;
      });

      // Handle add listener: choose an item
      $(window).ready(function () {
        $('.dev-engine button')
          .not('.btn-add')
          .click(function () {
            const url = $(this).attr('src');

            // Create new tab
            chrome.tabs.create(
              {
                url
              },
              function () {}
            );
          });
      });

      // Handle add listener: add a bookmark
      $('.dev-engine .btn-add').click(function () {
        const resourceKey = $(this).attr('data-resource');

        chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
          const link = tabs[0].url;
          const icon = tabs[0].favIconUrl;
          const title = tabs[0].title;
          const name = title.length < 13 ? title : `${title.slice(0, 10)}...`;
          const type = resourceKey;

          const newItem = {
            id: genId(5),
            name,
            icon,
            link,
            type
          };

          fetch(`${BASE_API_URL}/tools`, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(newItem)
          })
            .then((response) => response.json())
            .then((store) => store);
        });
      });

      // Handle add listener: del a bookmark
      $('.dev-engine .btn-del').click(function (e) {
        e.preventDefault();

        const id = $(this).prev().attr('id');

        fetch(`${BASE_API_URL}/tools/${id}`, {
          method: 'DELETE'
        })
          .then((response) => response.json())
          .then((result) => result);
      });
    });
})();
