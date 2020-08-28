<h1 align="center">Welcome to vue-pc-template 👋</h1>
<p align="center">
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <img src="https://img.shields.io/badge/node-%3E%3D%2012.18.0-blue.svg" />
  <img src="https://img.shields.io/badge/npm-%3E%3D%206.14.0-blue.svg" />
  <a href="https://github.com/PLQin/vue-pc-template#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/PLQin/vue-pc-template/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/PLQin/vue-pc-template/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/github/license/1/vue-pc-template" />
  </a>
</p>

> Vue PC端的模板。拥有基本的页面，例子和恰到好处的配置，fork后就可以立即使用。如果它帮助到你，请给我一颗星星。  
> 本仓库地址： https://github.com/PLQin/vue-pc-template。
> 你的star是我更新的动力。


## 💋 鸣谢

感谢 [vuejs/vue](https://github.com/vuejs/vue)，还有其他所有的开源作者。


## 😜 功能与配置

- `mock`  
  运行命令`npm run mock`后，再运行命令`npm run serve:local`。或结合[vue-mock-cli](https://github.com/PLQin/vue-mock-cli)食用。

- 移动端适配  

- 路由缓存    
  本模版不支持 ***(也不计划支持)*** 全局配置路由缓存，有需要的话可以尝试引入`vue-navigation`之类的modules或者在 `<router-view />` 处进行自定义配置。

- 内置装饰器  
  有些场景使用装饰器比在代码里面硬编码显得更简单，比如防抖节流，确认提示等等，当前模版内置了一小部分装饰器，更多装饰器正在完善中。

- gzip打包压缩代码  
  通过配置压缩工具，可以在`build`的时候，自动将静态资源压缩为`gz`文件，当部署的服务器 启用`gzip`功能后，将会自动加载压缩的文件，提高加载速度。

- 二次封装`axios`  
  本模版对`axios`进行了二次封装，使用时只需要调整一下`token`获取方式，封装文件位置在 `src/utils/request.js`。

- 日期工具类  
  本模版食用 [dayjs](https://github.com/xx45/dayjs)，它在GitHub上有28.2K的赞，是一个使用范围极广的时间日期库，更重要的是：
  - 支持UTC
  - 支持国际化  
  - 相比moment.js加上locals后3，400KB的体积，dayjs只有2KB  

- 代码规范与提交规范    
  本模版内部集成了`eslint`，全方位的去管控代码规范，为了方便使用，建议使用开发工具如 `vscode` 时需要安装`EsLint`插件。  

  虽然定义了`eslint`，但是假如在提交代码时不去校验，那么也无法有效的限制，所以定义了提交规范，在提交时会自动校验代码格式，并自动格式化。

- `cdn`  
  如果项目需要使用`cdn`的话，经常会将`cdn`的地址添加到`index.html`文件内，同时要对开发和生产环境进行区分，为了方便开发，模版内将`cdn`提取到了固定的文件内`cdn.js`，在这个文件内可以指定哪些文件使用`cdn`，同时有开关可以直接关闭`cdn`，具体文件在 `config/cdn.js`文件中。

- 目录结构  
  整个模版目录结构比较完整，基本可以满足常规开发，同时，为了提供功能复用，对于组件，分成了`base`与`components`两个目录，`base`里面放没有业务的基本组件，`components`里面放业务相关的组件，同时`base`目录里面提供了一个`loading`组件，在页面使用时可以直接使用`this.$loading()`调用。

- 文档  
  在开发中，一种功能可能会有多种选择，为了满足大家多种选择的需求，本模版特意添加的文档模块，对存在多种方案配置的内容通过文档和示例的方式记录下来，方便大家切换。


## 😁 所有命令

  ```shell
  # 安装
  npm run install

  # 启动开发环境
  npm run serve

  # 其他人员配置开发环境(这样的话，各开发人员之间配置互不冲突)
  npm run serve:local

  # 启动开发环境(接口地址将指向测试数据的接口)
  npm run serve:mock

  # 打包
  npm run build

  # 打包(将log日志输出在当前目录)
  npm run build:log

  # 启动json-server提供测试数据
  npm run mock

  # 启动json-server提供测试数据（在服务器中）
  npm run mock:serve

  # 代码校验
  npm run lint
  ```

总结：  
平时开发时，只需要启动 `npm run serve` 即可。  
如果服务端暂时无法提供数据支撑，也只需同时启动 `npm run serve:mock` 与 `npm run mock`。  
当仅个别接口需要使用mock数据时，仅需将接口名例如 ：`url: '/goods',` 改为 `url: 'mock/goods',` 即可，此时仅需要启动`npm run serve` 与 `npm run mock`。


## 😥 常见问题



## 🔑 环境配置

- node >= 12.18.0
- npm >= 6.14.0


## 👤 贡献者

* Website: [@PLQin](https://segmentfault.com/u/_raymond)
* Github: [@PLQin](https://github.com/PLQin)


## 🤝 参与贡献

问题或功能请求都是受欢迎的! 请查看[issue页面](https://github.com/PLQin/vue-pc-template/issues). 


## 📝 License

Copyright © 2020 [PLQin](https://github.com/PLQin).<br />
This project is [MIT](https://github.com/PLQin/vue-pc-template/blob/master/LICENSE) licensed.

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_