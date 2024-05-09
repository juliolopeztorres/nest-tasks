import { PositiveNumberValidationPipe } from './positive-number-validation.pipe';

describe('PositiveNumberValidationPipe', () => {
  describe('transform', () => {
    it('should not modify valid number', () => {
      expect(new PositiveNumberValidationPipe().transform(18)).toBe(18);
    });

    it('should fail with invalid number', () => {
      expect(() => new PositiveNumberValidationPipe().transform(-18)).toThrow(
        'Invalid positive number entered -18',
      );
    });
  });
});
