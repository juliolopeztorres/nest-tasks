export class Task {
  private constructor(
    readonly id: number,
    readonly description: string,
    readonly user?: string,
  ) {}

  public static create(id: number, description: string, user?: string): Task {
    return new Task(id, description, user);
  }
}
