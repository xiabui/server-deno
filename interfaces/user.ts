export interface User {
    id?: number;
    username: string;
    firstname: string;
    lastname: string;
    password: string;
    email: string;
    dateOfBirth: string;
    imageUrl: string;
    roleID: number;
    address: string;
    province: string;
    city: string;
    ward: string;
    country: string;
    postcode: number;
    verified: boolean;
  }