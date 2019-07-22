import { User } from "./User";

export class Company {
  name: string;
  users: User[];
  uri: string;

  constructor(name: string, users: User[], uri: string) {
    this.name = name;
    this.users = users;
    this.uri = uri;
  }
}