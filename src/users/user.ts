export class User {
  private constructor(
    readonly uid: string,
    readonly email: string,
  ) {}

  public static create(uid: string, email: string): User {
    return new User(uid, email);
  }
}
