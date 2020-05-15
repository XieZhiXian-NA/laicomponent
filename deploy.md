# 规范代码提交

## 上传之前，进行本地验证

1. 在本项目下执行 npm link
    创建软连接  node的全局node_modules----laicomponent
2. 在测试项目中 npm link laicomponent
   testLai的node_modules ------node全局node_modules------laicomponent
3. 可在testLai的package.json中添加
   "laicomponent":"0.1.0"依赖
4. 可在testLai中引入组件库

## 发布到npm

1.检测代码格式--lint
  当warning数量大于5时，不通过
2.cross-env 跨平台设置环境变量
  默认的test执行一次后还处于watch状态，设置CI=true则将所有测试用例跑一遍后直接返回结果
3.使用prepare声明周期钩子，当npm publish之前执行

```js
    "lint": "eslint --ext js,ts,tsx src --max-warnings 5",
    "test:nowatch": "cross-env CI=true react-scripts test --env=jest-environment-jsdom-sixteen ",
    "prepare": "npm run test:nowatch && npm run lint &&  npm run build"

```

## 发布到git

安装husky,在执行commit之前进行操作
```js
"husky":{
    "hooks":{
      "pre-commit":"npm run test:nowatch && npm run lint"
    }
  },

```

## 精简dependencies

1.将没有必要的移动到开发依赖中
2.解决安装出现多个react引用的错误
在安装laicomponet时，包含必须需要的依赖，如项目环境不满足，提示警告
```js

"peerDependencies": {
    "react": ">= 16.8.0",
    "react-dom": ">=16.8.0"
  },
```

## 参数

1. main 项目入口文件 支持的是commen.js
2. module 优先使用esModule 的入口文件 
3. types typescript的入口文件 .d.ts 开发提示文件入口




## 生成打包文件---需要上传到npm

1. 将ts文件编译为js文件 配置ts编译参数

```js
{
    "compilerOptions":{
        "outDir":"dist",
        //支持import方式的引入 也就是esmodule
        "module":"esnext",
        "target":"es5",
        //生成 .d.ts 定义文件的提示文件
        "declaration":true,
        //将jsx使用react.createElement装换
        "jsx":"react",
        // 对模块绝对路径和相对路径的查找方式与node不同，需要设置为按照node查找文件路径的方法
        "moduleResolution":"node",
        // 允许使用default的引入  否则需要使用import * as React from 'react'
        "allowSyntheticDefaultImports": true,
    },
    //只编译src目录下的文件
    "include":[
        "src"
    ],
    //排除不需要编译的文件
    "exclude":[
        "src/**/*.test.tsx",
        "src/**/*.stories.tsx",
        "src/setupTests.ts"
    ]
}

```


2. 使用node-sass编译将scss编译为css

```js
    "clean": "rimraf ./dist",
    "build": " npm run clean && npm run build-ts && npm run build-css",
    "build-ts": "tsc -p tsconfig.build.json",
    "build-css": "node-sass ./src/styles/index.scss ./dist/index.css",
    "prepare": "npm run test:nowatch && npm run lint &&  npm run build"
```

## 只上传dist文件

```js
    "files": [
        "dist"
    ],

```


## CI持续集成

1. 频繁将代码集成到主干
2. 快速发现错误
3. 防止分支大幅偏离主干
4. 自动化测试 一个测试失败则不能集成

## CD持续交付、持续部署

1. 频繁的将软件的新版本，交付给质量团队或者用户
2. 代码通过评审以后，自动部署到生产环境

## travis-ci

工作原理
当git push后，travis-ci会检测并从github镜像拉取最新的项目
执行npm install
执行.travis.yml中的命令脚本（默认执行npm test）
再将build生成的文件push到镜像中

需要使用"prepublishOnly",只会在publish时，执行
prepublish/prepare会在install/publish时执行两次

## 部署到githubPages

1. 项目部署成功后，在github镜像setting中选择分支
2. [https://xiezhixian-na.github.io/laicomponent/]

```js
language: node_js
node_js:
  - "stable"
cache:
//使用缓存，不用每次安装都install
  directories:
  - node_modules
env:
  - CI=true
script:
  - npm run build-storybook
deploy:
 //部署到github-pages中
  provider: pages
  skip_cleanup: true
  github_token: $github_token
  //将生成的storybook-static上传到gh-pages分支
  local_dir: storybook-static
  on:
    //项目代码位于test1镜像中
    branch: test1
```