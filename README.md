# webpack集成demo

## 关键字

webpack webpack-dev-server mock angularJs nodeJs jquery babel babel-polyfill es6

## 目的
编写前端主流自动化框架搭建demo,方便后续参考

## 使用方式
1. 安装Node.js后，按npm安装package.json中描述的依赖，不再赘述
2. 启动前端工程 npm run start
3. 启动模拟restful接口服务器 npm run mock
4. 开发环境打包 npm run build
5. 生产环境打包 npm run release

## 特殊说明
1. css的打包会自动收集src中所有以.css结尾的文件，不再需要手动配置
2. 需要新增的页面放置在view中，规则范例如下：
   /目录1/目录2/目录1_目录2.html  /目录1/目录2/目录1_目录2-controller.js
   新增后在example.config.js中新增一条js路径的配置，让webpack能够正确识别多入口
3. restful接口测试模拟桩在放在test/mock文件夹下，命名规则与restful接口访问路径有关,规则：
   比如,/rest/contentService/queryContent，那么新增contentService文件夹后，
   在新增的文件夹下建立queryContent.json  .json内容是个对象method属性是个数组，
   用于描述支持的请求方式，data属性是要真实返回的值。
## 参考链接
1. [webpack中文文档](https://doc.webpack-china.org/guides/)
2. [express](http://www.expressjs.com.cn/)
3. [Node.js文档](http://nodejs.cn/api/fs.html)
4. [angular.js](https://angularjs.org/)
