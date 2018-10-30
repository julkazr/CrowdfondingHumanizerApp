export class User {
  id?: string;
  name?: string;
  email?: string;
  username?: string;
  password?: string;
  status?: UserStatus;
  photoUrl?: string;
  isNewsletterFieldChecked?: boolean;
  dateOfBirth?: Date;
  isAdmin?: boolean;

  constructor() {}
}

export enum UserStatus {
  Online = 'online',
  Offline = 'offline'
}
