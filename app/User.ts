import { Uris } from "./Uris";

export class User {
  name: string;
  email: string;
  uris: Uris;

  constructor(name: string, email: string, uris: Uris) {
    this.name = name;
    this.email = email;
    this.uris = uris;
  }
}