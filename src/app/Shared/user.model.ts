export class UserInfo {
    firstName!: string;
    lastName!: string;
    age!: number;
    email!: string;
    address!: string;
    phone!: string;
    zipcode!: string;
    avatar!: string;
    gender!:string;
}
export class User extends UserInfo {
    password!: string;
}