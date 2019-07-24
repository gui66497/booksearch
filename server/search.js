const { client, index, type } = require('./connection')

module.exports = {
  /** Query ES index for the provided term */
  queryTerm (term, offset = 0) {
    const body = {
      from: offset,
      query: { multi_match: {
        "type": "best_fields",
        "query": term,
        "lenient": true
      } },
      highlight: { fields: { "*": {} }, 
                "pre_tags": ["<em>"],
                "post_tags": ["</em>"], }
    }

    return client.search({ index, type, body })
  },

  /** Get the specified range of paragraphs from a book */
  getParagraphs (bookTitle, startLocation, endLocation) {
    const filter = [
      { term: { title: bookTitle } },
      { range: { location: { gte: startLocation, lte: endLocation } } }
    ]

    const body = {
      size: endLocation - startLocation,
      sort: { location: 'asc' },
      query: { bool: { filter } }
    }

    return client.search({ index, type, body })
  }
}
