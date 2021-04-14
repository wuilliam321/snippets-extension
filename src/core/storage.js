function Storage({service}) {
  if (!service) {
    throw new Error('store service should be provided');
  }

  const set = (key, value) => {
    if (key === undefined || value === undefined) {
      return null;
    }
    return new Promise((resolve) => {
      const items = {};
      items[key] = value;
      service.set(items, () => resolve(items));
    });
  };

  const get = (key) => {
    if (key === undefined) {
      return null;
    }
    return new Promise((resolve) => {
      service.get([key], (data) => resolve(data));
    });
  };

  const remove = (key) => {
    if (key === undefined) {
      return null;
    }
    return new Promise((resolve) => {
      service.remove(key, (data) => resolve(data));
    });
  };

  return {
    set,
    get,
    remove, // not tested
  };
}
export default Storage;
