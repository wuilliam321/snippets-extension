import api from './api';
import storage from './storage';

// TODO aqui voy can lo de meter es storage aqui para luega utilizarlo por todos lados
// necesito aqui abrir los tests, asegurarme que el store se llama o algo asi

function Settings(store) {
  if (!store) {
    if (!chrome) {
      throw new Error('store should be provided');
    }
    store = chrome.storage.sync;
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
        // console.log('fetchSnippets', data);
        if (data) {
          // console.log('setSnippets', data);
          await setSnippets(data);
          // console.log('resolve', data);
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
