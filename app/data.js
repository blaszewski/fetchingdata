document.onreadystatechange = () => {
  if (document.readyState === "complete") {
    const apiUrl = "http://localhost:3000";

    function createDom(data) {
      let template = '<div class="container">';

      for (const [index, company] of data.entries()) {
        template += `<div class="d-flex flex-column">
                <button type="button" class="p-2 list-group-item list-group-item-action text-center" data-toggle="collapse" href="#collapse${index}" role="button" aria-expanded="false" aria-controls="collapse${index}">
                    ${
                      company.name
                    } <span class="badge badge-primary badge-pill">${
          company.users.length
        }</span>
                </button>`;

        template += `<div class="collapse" id="collapse${index}">`;

        for (const user of company.users) {
          if (user.uris.company === company.uri)
            template += `<div class="user text-center p-2">Name: <strong>${
              user.name
            }</strong>, e-mail: <strong>${user.email}</strong></div>`;
        }

        template += `</div></div>`;
      }
      template += "</div>";

      return template;
    }

    function prepareData(companies, users) {
      let data = companies.map(company => {
        company.users = users.filter(user => user.uris.company === company.uri);
        return company;
      });

      return data.sort((a, b) => b.users.length - a.users.length);
    }

    function getData() {
      return Promise.all([
        fetch(`${apiUrl}/companies`).then(res => res.json()),
        fetch(`${apiUrl}/users`).then(res => res.json())
      ]);
    }

    function init() {
      getData()
        .then(([companies, users]) => {
          const dataToRender = prepareData(companies, users);
          document.querySelector(".list").innerHTML = createDom(dataToRender);
        })
        .catch(err => console.log("Rejected: ", err.message));
    }

    init();
  }
};
