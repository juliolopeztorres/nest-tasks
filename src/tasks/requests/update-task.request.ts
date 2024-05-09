import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateTaskRequest {
  @IsNotEmpty()
  @IsNumber()
  readonly id: number;

  @IsNotEmpty()
  @IsString()
  readonly description: string;
}
