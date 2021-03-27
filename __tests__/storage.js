import storage from '../src/core/storage';

const service = {
  set: jest.fn((_, cb) => cb()),
  get: jest.fn((items, cb) => cb(items)),
};

describe('Storage set', () => {
  test('if no storage service provided should throw error', async () => {
    // Todo we need tests to guarantee the interface
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

  test('should not be null if key and value given', async () => {
    const store = storage(service);
    const result = await store.set('key', 'value');
    expect(result).not.toBeNull();
  });

  test('should return an object key=>value', async () => {
    const store = storage(service);
    const result = await store.set('key', 'value');
    expect(result.key).toBe('value');
  });

  test('should return an object one=>foo', async () => {
    const store = storage(service);
    const result = await store.set('one', 'foo');
    expect(result.one).toBe('foo');
  });

  test('should not be undefined if key and value given', async () => {
    const store = storage(service);
    const result = await store.set('key', 'value');
    expect(result).not.toBeUndefined();
  });

  test('given service callback called with value2 should return it', async () => {
    const store = storage(service);
    const result = await store.set('key', 'value2');
    expect(result.key).toBe('value2');
  });
});

describe('Storage get', () => {
  test('should return null if no key given', async () => {
    const store = storage(service);
    const result = await store.get();
    expect(result).toBeNull();
  });

  test('should not be null if key', async () => {
    const store = storage(service);
    const result = await store.get('key');
    expect(result).not.toBeNull();
  });

  test('should return an object key=>value', async () => {
    const overridenService = {
      set: jest.fn((_, cb) => cb()),
      get: jest.fn((_, cb) => cb({ key: 'value' })),
    };
    const store = storage(overridenService);
    const result = await store.get('key');
    expect(result.key).toBe('value');
  });

  test('should return an object one=>foo', async () => {
    const overridenService = {
      set: jest.fn((_, cb) => cb()),
      get: jest.fn((_, cb) => cb({ one: 'foo' })),
    };
    const store = storage(overridenService);
    const result = await store.get('one');
    expect(result.one).toBe('foo');
  });
});
