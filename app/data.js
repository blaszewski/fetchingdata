const apiUrl = "http://localhost:3000";
// let preparedData = [];

// function pagination(page = 1, quantity = 20) {
//   let data = preparedData.slice((page-1)*quantity, (page*quantity));
//
//   document.querySelector('.list').innerHTML = createDom(data);
// }

function createDom(data) {
  let template = '<div class="container">';

  for (let i=0; i<data.length-1;i++) {
    let company = data[i];
    template += `<div class="d-flex flex-column">
                  <button type="button" class="p-2 list-group-item list-group-item-action text-center" data-toggle="collapse" href="#collapse${i}" role="button" aria-expanded="false" aria-controls="collapse${i}">
                    ${company.name} <span class="badge badge-primary badge-pill">${company.users.length}</span>
                  </button>`;

    template += `<div class="collapse" id="collapse${i}">`;

    for (const user of company.users) {
      if (user.uris.company === company.uri)
        template += `<div class="user text-center p-2">${user.name}, <strong>${user.email}</strong></div>`;
    }

    template += `</div></div>`;
  }
  template += "</div>";

  return template;
}

Promise.all([
  fetch(`${apiUrl}/companies`).then(res => res.json()),
  fetch(`${apiUrl}/users`).then(res => res.json())
])
  .then(([companies, users]) => {
    // console.log("companies, users: ", companies, users);

    let dataToRender = companies.map(company => {
      company.users = users.filter(user => user.uris.company === company.uri);

      return company;
    });

    dataToRender = dataToRender.sort((a, b) => b.users.length - a.users.length);

    // preparedData = dataToRender;
    document.querySelector('.list').innerHTML = createDom(dataToRender);
    // pagination();

    // console.log("data to render: ", dataToRender);

  })
  .catch(err => console.log('Rejected: ', err.message));

