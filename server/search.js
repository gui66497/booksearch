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

  /** 根据中文名精确查找*/
  queryByFileName (fileNames) {
    let phrases = [];
    // 构造多条件语句
    fileNames.forEach(f => {
      phrases.push({
        "match_phrase": {
          "path.virtual": f
        }
      })
    });
    const body = {
      "query": {
        "bool": {
          "should": [
            phrases
          ],
          "minimum_should_match": 1
        }
      }
    };
    return client.search({ index, type, body })
  },

  /** 获取文档总数 */
  async queryCount() {
    return await client.count({index, type})
  }

}
