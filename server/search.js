const { client, index, type } = require('./connection')

module.exports = {
  /** Query ES index for the provided term */
  queryTerm (term, offset = 0) {
    const body = {
      from: offset,
      query: {
        multi_match: {
          "type": "best_fields",
          "query": term,
          "lenient": true
        }
      },
      highlight: {
        fields: {"*": {}},
        "pre_tags": ["<em>"],
        "post_tags": ["</em>"],
      }
    };

    return client.search({ index, type, body })
  },

  /** 获取文档总数 */
  async queryCount() {
    return await client.count({index, type})
  }

}
