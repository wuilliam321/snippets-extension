function Settings({ store, api }) {
  const triggerKey = '/'; // TODO: Repeated code

  if (!store) {
    throw new Error('store should be provided');
  }

  const getSnippetByShortcode = async (shortcode) => {
    try {
      if (!shortcode) {
        return -1;
      }

      const snippets = await getSnippets();
      const snippet = snippets.find((s) => s.shortcode === shortcode);

      if (!snippet) {
        return -1;
      }

      return snippet;
    } catch (err) {
      throw err;
    }
  };

  const setSnippets = async (snippets) => {
    try {
      if (snippets === undefined) {
        return [];
      }
      if (snippets && snippets.length) {
        const res = await store.set('snippets', snippets);
        if (Object.keys(res).length) {
          // TODO not tested
          return res.snippets;
        }
      }
      return [];
    } catch (err) {
      throw err;
    }
  };

  const getMapSnippets = async () => {
    try {
      const snippets = await getSnippets();
      const snippetsMap = snippets.reduce((prev, curr) => {
        prev[curr.shortcode + triggerKey] = curr;
        return prev;
      }, {});
      return snippetsMap;
    } catch (err) {
      throw err;
    }
  };

  const getSnippets = async () => {
    // TODO not tested
    try {
      const res = await store.get('snippets');
      if (!res || !res.snippets) {
        return [];
      }
      return res.snippets;
    } catch (err) {
      throw err;
    }
  };

  const fetchSnippets = async (userId) => {
    try {
      const data = await api.getSnippets(userId);
      if (data) {
        await setSnippets(data);
        return data;
      }
      return [];
    } catch (err) {
      throw err;
    }
  };

  return {
    getSnippetByShortcode,
    setSnippets,
    getSnippets,
    getMapSnippets,
    fetchSnippets,
  };
}

export default Settings;
