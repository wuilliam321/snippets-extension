/**
  * This is just a sample test
  *
  * Change when we start working an the extension
  */
function sum(a, b) {
  return a + b;
}

describe('Sample Test', () => {
  test('1 + 2 should be equal to 3', () => {
    expect(sum(1, 2)).toBe(3);
  });

  test('0 + 0 should be equal to 0', () => {
    expect(sum(0, 0)).toBe(0);
  });
});
