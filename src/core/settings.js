function Settings() {
  let allSnippets = [];

  const getSnippetByShortcode = (shortcode) => {
    if (!shortcode) {
      return -1;
    }

    const snippet = allSnippets.find((s) => s.shortcode === shortcode);

    if (!snippet) {
      return -1;
    }

    return snippet;
  };

  const setSnippets = (snippets) => {
    allSnippets = [];
    if (snippets && snippets.length) {
      allSnippets = snippets;
    }
    return allSnippets;
  };

  const getSnippets = () => {
    return allSnippets;
  };

  return {
    getSnippetByShortcode,
    setSnippets,
    getSnippets,
  };
}

export default Settings();
