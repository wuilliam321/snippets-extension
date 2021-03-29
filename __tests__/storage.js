import storage from '../src/core/storage';

const service = {
  set: jest.fn((_, cb) => cb()),
  get: jest.fn((items, cb) => cb(items)),
};

describe('Storage', () => {
  test('if no storage service provided should throw error', async () => {
    expect(() => storage()).toThrowError();
  });

  test('should return null if no key given', async () => {
    const store = storage(service);
    const result = await store.set();
    expect(result).toBeNull();
  });

  test('should return null if no value given', async () => {
    const store = storage(service);
    const result = await store.set('key');
    expect(result).toBeNull();
  });

  test('should return null if no key given', async () => {
    const store = storage(service);
    const result = await store.get();
    expect(result).toBeNull();
  });
});
