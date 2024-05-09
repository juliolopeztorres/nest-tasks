import { HttpException, HttpStatus, PipeTransform } from '@nestjs/common';

export class PositiveNumberValidationPipe
  implements PipeTransform<number, number>
{
  transform(value: number): number {
    if (value < 0) {
      throw new HttpException(
        `Invalid positive number entered ${value}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return value;
  }
}
