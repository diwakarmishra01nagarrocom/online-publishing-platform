/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {

  const articles = data.articles ?? [];

  const searchTerm =
    (data.searchTerm ?? '')
      .trim()
      .toLowerCase();


  // Empty search -> return all articles
  if (!searchTerm) {

    postMessage(articles);

    return;
  }


  // Filter articles inside Web Worker
  const filteredArticles =
    articles.filter((article: any) => {

      const title =
        article.title
          ?.toLowerCase() ?? '';

      const author =
        article.authorName
          ?.toLowerCase() ?? '';

      const description =
        article.description
          ?.toLowerCase() ?? '';

      const content =
        article.content
          ?.toLowerCase() ?? '';


      return (
        title.includes(searchTerm) ||
        author.includes(searchTerm) ||
        description.includes(searchTerm) ||
        content.includes(searchTerm)
      );

    });


  postMessage(filteredArticles);

});