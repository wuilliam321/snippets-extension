function Settings() {
  const snippets = [
    {
      id: 74,
      name: 'Greetings Mail',
      shortcode: 'bb',
      text:
        '<p><s>Strike</s></p><p><br></p><h1>Header 2</h1><ul><li>List</li><li class="ql-indent-1">List Padding</li></ul>',
      category_id: 62,
      pivot: {
        user_id: 57,
        item_id: 73,
        item_type: 'App\\Models\\Snippet',
        scope: 1,
        approved: 1,
      },
      category: {
        id: 62,
        name: 'test',
        color_id: 5,
        created_at: '2021-03-24T03:29:35.000000Z',
        updated_at: '2021-03-24T03:29:35.000000Z',
        color: { id: 5, hex: '#0077B6' },
      },
      labels: [],
      users: [],
    },
    {
      id: 73,
      name: 'Greetings Mail',
      shortcode: 'aa',
      text:
        '<p><s>Strike</s></p><p><br></p><h1>Header 1</h1><ul><li>List</li><li class="ql-indent-1">List Padding</li></ul>',
      category_id: 62,
      pivot: {
        user_id: 57,
        item_id: 73,
        item_type: 'App\\Models\\Snippet',
        scope: 1,
        approved: 1,
      },
      category: {
        id: 62,
        name: 'test',
        color_id: 5,
        created_at: '2021-03-24T03:29:35.000000Z',
        updated_at: '2021-03-24T03:29:35.000000Z',
        color: { id: 5, hex: '#0077B6' },
      },
      labels: [],
      users: [],
    },
  ];

  const getSnippetByShortcode = (shortcode) => {
    // const snippet = snippets.find(s => s.shortcode === shortcode);
    // console.log(snippets.filter(s => s.shortcode === 'aa'));
    // console.log(shortcode);
    // return snippet;
    return -1;
  };

  return {
    snippets,
    getSnippetByShortcode
  };
}

export default Settings();
