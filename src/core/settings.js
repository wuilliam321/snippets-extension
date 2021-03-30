import api from './api';

function Settings(store) {
  if (!store) {
    throw new Error('store should be provided');
  }

  const getSnippetByShortcode = async (shortcode) => {
    if (!shortcode) {
      return Promise.resolve(-1);
    }

    const snippets = await getSnippets();
    const snippet = snippets.find((s) => s.shortcode === shortcode);

    if (!snippet) {
      return Promise.resolve(-1);
    }

    return Promise.resolve(snippet);
  };

  const setSnippets = async (snippets) => {
    if (snippets === undefined) {
      return Promise.resolve([]);
    }
    if (snippets && snippets.length) {
      const res = await store.set('snippets', snippets);
      if (Object.keys(res).length) {
        // TODO not tested
        return Promise.resolve(res.snippets);
      }
    }
    return Promise.resolve([]);
  };

  const getSnippets = async () => {
    // TODO not tested
    const res = await store.get('snippets');
    if (!res || !res.snippets) {
      return Promise.resolve([]);
    }
    return Promise.resolve(res.snippets);
  };

  const fetchSnippets = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const data = await api.getSnippets();
        if (data) {
          await setSnippets(data);
          resolve(data);
        }
        resolve([]);
      } catch (err) {
        reject(err);
      }
    });
  };

  return {
    getSnippetByShortcode,
    setSnippets,
    getSnippets,
    fetchSnippets,
  };
}

export default Settings;
