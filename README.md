# booksearch

> 一个本地文档搜索引擎。

界面实时搜索，支持中文分词，支持上传文档，容器化部署。
前端：Vue、mui、vuejs-dialog、Kibana  
后端：NodeJS、Koa  
存储：Elasticsearch  
文档解析：Fscrawler


## Getting Started 使用指南

项目使用条件、如何安装部署、怎样运行使用以及使用演示

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

浏览器访问http://你的IP:8080/，顺利的话应该出现如下界面

![首页](http://cdn.guitang.fun/booksearch_1.png)

## License 授权协议

这个项目 MIT 协议。
