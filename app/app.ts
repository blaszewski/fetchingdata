const limit: number = 20;
let currentPage: number = 1;

const next: any = document.querySelector('.next');
const prev: any = document.querySelector('.prev');
const list: any = document.querySelector('.list');

class Company {
  name: string;
  users: User[];
  uri: string;

  constructor(name: string, users: User[], uri: string) {
    this.name = name;
    this.users = users;
    this.uri = uri;
  }
}
class User {
  name: string;
  email: string;
  uris: Uris;

  constructor(name: string, email: string, uris: Uris) {
    this.name = name;
    this.email = email;
    this.uris = uris;
  }
}
class Uris {
  company: string;

  constructor(company: string) {
    this.company = company;
  }
}

function createDom(data: Company[]): string {
  let template: string = '<div class="container">';

  for (const [index, company] of data.entries()) {
  console.log(company.name, company.users);
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

    template += "</div></div>";
  }

  template += "</div>";

  return template;
}

const getData = async (page: number): Promise<any[]> => {
  const baseUrl: string = 'http://localhost:3000';

  const queryCompanies: string = `/companies?_page=${page}&_limit=${limit}`;
  const queryUsers: string = `/users`;

  const resCompanies: Response = await fetch(baseUrl + queryCompanies);
  const dataCompanies = await resCompanies.json();

  const resUsers: Response = await fetch(baseUrl + queryUsers);
  const dataUsers = await resUsers.json();

  return [dataCompanies, dataUsers];
};

function prepareData(companies: Company[], users: User[]): [] {
  let data: any = companies.map(company => {
    company.users = users.filter(user => user.uris.company === company.uri);
    return company;
  });

  return data.sort((a: any , b: any) => b.users.length - a.users.length);
}
function loadData(): void {
  getData(currentPage)
    .then(([companies, users]) => {
      const dataToRender = prepareData(companies, users);
      list.innerHTML = createDom(dataToRender);
    })
    .catch(err => console.log("Rejected: ", err));

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
