export interface Company {
  name: string;
  users: User[];
  uri: string
}

export interface User {
  name: string;
  email: string;
  uris: {
    company: string
  }
}
