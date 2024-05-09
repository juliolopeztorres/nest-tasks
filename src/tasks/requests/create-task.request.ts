import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskRequest {
  @IsNotEmpty()
  @IsString()
  readonly description: string;
}
