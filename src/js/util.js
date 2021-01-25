/** Utils func */

// Item template
const itemTemplate = (resource) => {
  return `
    <div class="item">
      <button type="button" class="btn btn-light btn-sm" src=${
        resource.link
      } id="${resource.id}"
      data-toggle="tooltip" data-placement="bottom" title="${resource.name}"
      >
        <img class="icon" src=${resource.icon} alt=${
    resource.name
  } style="width: 18px; height: 18px;"/>
        <span class="name">${
          resource.name.length < 13
            ? resource.name
            : `${resource.name.slice(0, 10)}...`
        }</span>
      </button>
      <div class="btn-del"><span></span></div>
    </div>
  `;
};

// Add event click on an item
const addEventNewTabForEachBtn = (selector, except_selector, attr_url) => {
  $(selector)
    .not(except_selector)
    .click(function () {
      const url = $(this).attr(attr_url);

      // Create new tab
      chrome.tabs.create(
        {
          url
        },
        function () {}
      );
    });
};
