const vm = new Vue ({
  el: '#vue-instance',
  data () {
    return {
      baseUrl: 'http://API_HOST:3000', // API url
      searchTerm: 'fscrawler', // Default search term
      searchDebounce: null, // Timeout for search bar debounce
      searchResults: [], // Displayed search results
      numHits: null, // Total search results found
      searchOffset: 0, // Search result pagination offset

      selectedParagraph: null, // Selected paragraph object
      bookOffset: 0, // Offset for book paragraphs being displayed
      paragraphs: [], // Paragraphs being displayed in book preview window

      docCount: 0,  //文档总数
      fileCount:"", //选择文件数
      files:{},
      rate:"",  //上传进度
      options: {
        okText: '确定',  // 本地化确认按钮文字提示内容
        cancelText: '取消',  //本地化关闭按钮文字提示内容
      }
    }
  },
  async created () {
    this.searchResults = await this.search() // 触发搜索
    this.docCount = await this.count() //触发统计
  },
  methods: {
    /** Debounce search input by 100 ms */
    onSearchInput () {
      clearTimeout(this.searchDebounce)
      if (this.searchTerm) {
        this.searchDebounce = setTimeout(async () => {
          this.searchOffset = 0
          this.searchResults = await this.search()
        }, 100)
      }
    },
    /** Call API to search for inputted term */
    async search () {
      const response = await axios.get(`${this.baseUrl}/search`, { params: { term: this.searchTerm, offset: this.searchOffset } })
      this.numHits = response.data.hits.total.value
      return response.data.hits.hits
    },
    /** Call API to search for inputted term */
    async count () {
      const response = await axios.get(`${this.baseUrl}/count`)
      return response.data.count
    },
    /** 选择文件 */
    async selectfile() {
      document.querySelector('#files').click();
      this.fileCount = "";
      this.rate = "";
    },
    /** 执行上传 */
    async upload () {
      const files = this.files;
      if (Object.keys(files).length < 1) {
        this.$dialog.alert('请先选择文件！', this.options).then(function(dialog) {
          console.log('Closed');
        });
        return;
      }
      const formData = new FormData();      //创建form对象
      for(var i = 0; i < files.length; i++) {
        formData.append('file', files[i]);  //通过append向form对象添加数据
      }     
      axios.post(`${this.baseUrl}/upload`, formData, {
        onUploadProgress: (progressEvent) => {      //这里要用箭头函数
          //不然这个this的指向会有问题
          this.rate="上传进度：" + parseInt( (  progressEvent.loaded/progressEvent.total  ) * 100 );
        }
      }).then(response => {
          console.log("response" + response);
          this.$dialog.alert(response.data.message, this.options).then(function(dialog) {
            console.log('Closed');
          });
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    async changeFile (e) {
      this.files = e.target.files;
      this.fileCount = "选择了" + this.files.length + "个文件"
    },
    async cancle () {
      console.log("取消了")
    },

    /** Get next page of search results */
    async nextResultsPage () {
      if (this.numHits > 10) {
        this.searchOffset += 10
        if (this.searchOffset + 10 > this.numHits) { this.searchOffset = this.numHits - 10}
        this.searchResults = await this.search()
        document.documentElement.scrollTop = 0
      }
    },
    /** Get previous page of search results */
    async prevResultsPage () {
      this.searchOffset -= 10
      if (this.searchOffset < 0) { this.searchOffset = 0 }
      this.searchResults = await this.search()
      document.documentElement.scrollTop = 0
    },
    /** Call the API to get current page of paragraphs */
    async getParagraphs (bookTitle, offset) {
      try {
        this.bookOffset = offset
        const start = this.bookOffset
        const end = this.bookOffset + 10
        const response = await axios.get(`${this.baseUrl}/paragraphs`, { params: { bookTitle, start, end } })
        return response.data.hits.hits
      } catch (err) {
        console.error(err)
      }
    },
    /** Get next page (next 10 paragraphs) of selected book */
    async nextBookPage () {
      this.$refs.bookModal.scrollTop = 0
      this.paragraphs = await this.getParagraphs(this.selectedParagraph._source.title, this.bookOffset + 10)
    },
    /** Get previous page (previous 10 paragraphs) of selected book */
    async prevBookPage () {
      this.$refs.bookModal.scrollTop = 0
      this.paragraphs = await this.getParagraphs(this.selectedParagraph._source.title, this.bookOffset - 10)
    },
    /** Display paragraphs from selected book in modal window */
    async showBookModal (searchHit) {
      try {
        document.body.style.overflow = 'hidden'
        this.selectedParagraph = searchHit
        console.log("searchHit:", searchHit)
        //this.paragraphs = await this.getParagraphs(searchHit._source.title, searchHit._source.location - 5)
      } catch (err) {
        console.error(err)
      }
    },
    /** Close the book detail modal */
    closeBookModal () {
      document.body.style.overflow = 'auto'
      this.selectedParagraph = null
    }
  }
})
