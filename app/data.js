const limit = 20;
let currentPage = 1;

const next = document.querySelector('.next');
const prev = document.querySelector('.prev');

function createDom(data) {
  let template = '<div class="container">';

  for (const [index, company] of data.entries()) {
    template += `<div class="d-flex flex-column">
               <button type="button" class="p-2 list-group-item list-group-item-action text-center" data-toggle="collapse" href="#collapse${index}" role="button" aria-expanded="false" aria-controls="collapse${index}">
                   ${company.name} 
                  <span class="badge badge-primary badge-pill">
                   ${company.users.length}
                   </span>
                </button>`;

    template += `<div class="collapse" id="collapse${index}">`;

    for (const user of company.users) {
      if (user.uris.company === company.uri)
        template += `<div class="user text-center p-2">
           Name: <strong>${user.name}</strong>, 
           e-mail: <strong>${user.email}</strong></div>`;
    }

    template += `</div></div>`;
  }

  template += "</div>";

  return template;
}

const getData = async (page) => {
  const baseUrl = 'http://localhost:3000';

  const queryCompanies = `/companies?_page=${page}&_limit=${limit}`;
  const queryUsers = `/users`;

  const resCompanies = await fetch(baseUrl + queryCompanies);
  const dataCompanies = await resCompanies.json();

  const resUsers = await fetch(baseUrl + queryUsers);
  const dataUsers = await resUsers.json();

  return [dataCompanies, dataUsers];
};

function prepareData(companies, users) {
  let data = companies.map(company => {
    company.users = users.filter(user => user.uris.company === company.uri);
    return company;
  });

  return data.sort((a, b) => b.users.length - a.users.length);
}
function loadData() {
  getData(currentPage)
    .then(([companies, users]) => {
      const dataToRender = prepareData(companies, users);
      document.querySelector(".list").innerHTML = createDom(dataToRender);
    })
    .catch(err => console.log("Rejected: ", err.message));

  if (currentPage <= 1) {
    prev.classList.add('disabled');
  } else {
    prev.classList.remove('disabled');
  }

  if (currentPage >= 50) {
    next.classList.add('disabled');
  } else {
    next.classList.remove('disabled');
  }
}

next.addEventListener('click', () => {
  if (currentPage >= 1 && currentPage < 50) {
    currentPage++;
    loadData();
  }
});

prev.addEventListener('click', () => {
  if (currentPage > 1 && currentPage <= 50) {
    currentPage--;
    loadData();
  }
});

loadData();
