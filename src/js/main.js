// Render

(() => {
  $.getJSON('store.json', (allResource) => {
    const keys = Object.keys(allResource);

    keys.forEach((key) => {
      if (!allResource[key].length) return;

      let result = '';

      allResource[key].map((resource) => {
        result += `
        <button type="button" class="btn btn-light btn-sm" src=${resource.link}>
          <img class="icon" src=${resource.icon} alt=${resource.name} style="width: 18px; height: 18px;"/>
          <span class="name">${resource.name}</span>
        </button>
        `;
      });

      document.getElementById(`${key}-list`).innerHTML = result;
    });
  });
})();

// Handle click add bookmark
(() => {
  $('.dev-engine .btn-add').click(() => {
    const resourceKey = $(this).attr('data-resource');
    console.log($(this).attr('class'));

    console.log(resourceKey);
  });
})();
