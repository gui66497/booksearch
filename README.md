# booksearch

> 一个本地文档搜索引擎。

界面实时搜索，支持中文分词，支持上传文档，容器化部署。  
前端：Vue、mui、vuejs-dialog、Kibana  
后端：NodeJS、Koa  
存储：Elasticsearch  
文档解析：Fscrawler


### Prerequisites 项目使用条件

1. 克隆本项目到本地
2. 安装docker和docker-compose
3. 修改docker-compose.yml->frontend->command一栏，将其中的IP地址修改为你的实际IP

### Installation&Run 安装和运行

理论上只需要一条命令既可启动本项目：

```bash
docker-compose up -d --build
```

### Usage 使用

浏览器访问http://你的IP:8080 ，顺利的话应该出现如下界面

![首页](http://cdn.guitang.fun/booksearch_1.png)

## Principle 原理

通过Fscrawler来进行文档的录入，只需要简单的配置，实现将本地文件系统的文件导入到ES中进行检索，同时支持丰富的文件格式（txt.pdf,html,word...）  

中文分词采用IK分词插件，Fscrawler支持手动配置Mapping，所以文档录入后就支持中文搜索  

前端使用mui这一简单而又高性能的UI框架来构建页面，与后台通过axios来进行交互  

后台主要使用了koa2框架对ES查询做了一层封装  

最后将五个模块写进一个docker-compose.yml文件中实现一键执行。


## License 授权协议

本项目遵循 MIT 协议。

