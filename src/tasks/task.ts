export class Task {
  private constructor(
    readonly id: number,
    readonly description: string,
  ) {}

  public static create(id: number, description: string): Task {
    return new Task(id, description);
  }
}
