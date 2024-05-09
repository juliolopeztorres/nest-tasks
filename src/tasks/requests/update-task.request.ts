import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTaskRequest {
  @IsNotEmpty()
  @IsString()
  readonly description: string;
}
