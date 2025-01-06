import { Transform } from 'class-transformer';
import { IsDate } from 'class-validator';
import { Between, FindOperator } from 'typeorm';

export interface BetweenAdapter<T> {
  start: T;
  end: T;

  adapt(): FindOperator<T>;

  validate(value: T): boolean;
}

export class BetweenDatesAdapter implements BetweenAdapter<Date> {
  @Transform(({ value }) => new Date(value))
  @IsDate()
  start: Date;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  end: Date;

  constructor(year: number) {
    this.start = new Date(`${year}-01-01`);
    this.end = new Date(`${year + 1}-01-01`);
  }

  adapt() {
    return Between(this.start, this.end);
  }

  validate(value: Date): boolean {
    return (
      value.getTime() >= this.start.getTime() &&
      value.getTime() < this.end.getTime()
    );
  }
}
