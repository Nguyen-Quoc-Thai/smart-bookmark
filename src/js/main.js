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

/** Render popup & add listener */
(() => {
  // Popup render
  fetch(`${BASE_API_URL}/tools`)
    .then((response) => response.json())
    .then((store) => {
      keys.forEach((key) => {
        // Filter each category
        const items = store.filter((el) => el.type === key);

        // Resource is empty
        if (!items.length) return;

        // Update view
        let result = '';
        items.map((resource) => {
          result += itemTemplate(resource);
        });
        document.getElementById(`${key}-list`).innerHTML = result;
      });

      // Handle add listener: choose an item (create new tab)
      $(window).ready(function () {
        addEventNewTabForEachBtn('.dev-engine button', '.btn-add', 'src');
      });

      // Handle add listener: Add a new bookmark on btn add
      $('.dev-engine .btn-add').click(function () {
        const curr = $(this);

        chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
          // Create a new item
          const resourceKey = curr.attr('data-resource');

          const link = tabs[0].url;
          const icon = tabs[0].favIconUrl;
          const title = tabs[0].title;
          const name = title;
          const type = resourceKey;

          const newItem = {
            name,
            icon,
            link,
            type
          };

          // Call API -  send new item
          fetch(`${BASE_API_URL}/tools`, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(newItem)
          })
            .then((response) => response.json())
            .then((newResource) => {
              // Text notification
              const msg = `<span class="msg-success text-success">Thêm thành công</span>`;

              $(msg).insertAfter(curr);
              setTimeout(function () {
                curr.next().html('');
              }, 2000);

              // Update view
              let newNode = itemTemplate(newResource);
              curr.prev().append(newNode);
            });
        });
      });

      // Handle add listener: del a bookmark
      $('.dev-engine .btn-del').click(function () {
        const curr = $(this);

        const id = curr.prev().attr('id');

        fetch(`${BASE_API_URL}/tools/${id}`, {
          method: 'DELETE'
        })
          .then((response) => response.json())
          .then((result) => {
            // Update view
            curr.parent().addClass('d-none');
          });
      });
    });
})();
