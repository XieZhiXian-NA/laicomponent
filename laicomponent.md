### 组件库

组件库，通过传入组件的不同属性，具有一定的事件而去判断，去生成不同的样式

classnames可以条件判断是否将该class添加给该组件

1. 代码结构
2. 样式解决方案
3. 组件需求分析和组件测试用例
4. 代码打包输出和发布 
5. CI/CD文档生成

+ 使用react-script-app 开启eslint的检查 .vscode 下添加settings.json

### 样式系统

 styles/

​     _variables.scss 各种变量以及可配置设置

​     _ mixins.scss 全局的mixins

​     _functions.scss 全局的functions

​     index.scss  将所有的样式汇总

 components/

​      Button/

​          _style.scss 组件单独的样式

!default 可以让别人可以修改颜色 当用户没有使用定义该值时，就使用默认值

normalize.css  保护浏览器的默认样式，并不是完全清除 ，可以在里面配置自己需要的样式

_xx.scss  partials 不需要将其编译为css文件  只能是模块被导入

@import并不创建一个http请求，是在文件编译时，就自动引入其包含进入文件中

@mixin @include是将代码负责进来 可以传参

@extend x 是z在x之后添加当前样式名

$变量  是一个属性值 如果需要将变量作为属性则需要使用插值

 `#{}` 插值语句可以在选择器或属性名中使用变量  动态值

+ 色彩

​      中性色
​      基础色 红黄绿蓝。。。
​      系统色 primary info success

+ 字体系统

   字体家族    sans-serif字体作为默认字体   等宽字体：第二字体，兼容。

   字体基础大小base  rem:相对于html字体的大小默认16px

  ​                       lg sm

  字重： lighter light normal bold bolder 

  行高: 

  标题

  链接

+ 表单 

+ 按钮

+ 边框阴影

+ 可配置变量开关

### Button

需求分析 

  a链接区别对待 本身没有disabled属性，需要通过class加上该样式

  button原生默认的属性

+ 不同的ButtonType  [primary default danger a元素]
+ 不同的ButtonSize [normal small large]
+ 按钮的状态 Disable可用不可用 

1. 根据组件的基本使用 决定其baseProps 

2. 根据不容的props，使用classnames赋予不同的样式

   ```js
   const classes = classnames('btn', className,{
           [`btn-${btnType}`]:btnType,
           [`btn-${size}`]:size,
           'disabled':(btnType=== 'link') && disabled
       })
   ```

3. 在使用button及a标签的原生属性时，将其都变为可选的

   ```js
   Partial<NativeButtonProps & AnchorButtonProps>;
   ```

Button样式

+ padding

+ line-height

+ color

+ border border-shadow disabled

  &.disabled 所有class为btn以及disabled

  &[disabled] class为btn并且含有disabled属性
  
### input

   1. 基本样式 不同大小 disabled 

   2. 带图标 带前缀后缀

      ```js
      <Input
        disabled
        size = "lg | sm"
        icon="fontawesome支持的图标"
        prepand="input前缀，string，或者ReactElement"
        append="input 后缀 string 或者 ReactElement" 
        {...restProps} 支持其他所有的HTMLInput属性
      />
      ```
      
   3. input的size属性与InputElement冲突 

         ```js
         Omit<InputHTMLAttributes<HTMLElement>,'size'>排除属性
         ```
         
  4. 受控组件
     ```js
         在react合成事件中 受控组件的事件是onChange()监听value值
         vue type="text" 是input事件
         
         onChange?:(e:ChangeEvent<HTMLInputElement>)=>void
         
         同一组价只能为受控和非受控组件
         在设计中 若同时存在是value 和defaultValue  将defaultvalue删除以受控组件为主
         当组件从非受控组件变为受控组件时，若设置的value初始值为null/undefined,会报错 这里需要重新设置一下
     ```
     
###   AutoComplete

​       根据输入值可以筛选 点击筛选出来的结果 可以自动填入输入框中

   1. 将筛选的具体方法暴露给使用开发者，使其自己编写，在输入值发生改变时，调用该函数，得到下拉框的值

   2. 用户自己的渲染选项 在下拉框中，用户可以自定义需要渲染的模板

   3. 防抖节流  不必每次value值发生改变 都要去请求数据 利用useEffect() 每次渲染的隔离 再次渲染时，直接清除

      ```js
      function UseDebounce(value,delay){
          const [inputValue,setInputValue] = useState(value)
          useEffect(()=>{
              let handler = window.setTimeOut(()=>{
                  setInputValue(value)
              },delay)
              return ()=>{
                  clearTimeOut(handler)
              }
          },[value])
      }
      ```

   4. 键盘事件 

      ```js
      点击键盘上下键 高亮显示选择的内容 做边界限制 --- 下移到最顶部最底部
      ```

   5. 点击其他区域 回收下拉列表 以及回显选中的值，而回显后 不应该在发送请求 

      需要不隔离渲染的变量 useRef保存是否发请求的判断

      ```js
      useRef获取容器dom componentRef
      useEffect(()=>{
          // 当点击的不是容器组件内部的dom 下拉菜单回收 
            const listener = (event:MouseEvent)=>{
                 if(!ref.current || ref.current.contains(event.target as HTMLElement)) return
                 handler(event)
             }
             document.addEventListener('click',listener)
             return ()=>{
                 document.removeEventListener('click',listener);
             }  
      },componentRef)
      ```

      ```JS
      handleFetch = (query:string)=>{
          return fetch(`https://api.github.com/search/users?q=${query}`)
                 .then(res=>res.json())
                 .then(({items})=>{
                     console.log('ddd',items)
                     return items.slice(0,10).map( (item:any) =>                       ({value:item.login,...item}))
                 })
      }
       const renderOption = (item:DataSourceType<GithubUserProps>)=>{
           return (
               <div>
                   <h2>Name:{item.login}</h2>
                   <h4>url:{item.url}</h4>
               </div>
      )}
      <AutoComplete
        // 暴露出来的用户自己定义过滤数据的规则
        fetchSuggestion = {handleFetch}
        // 暴露出来的用户自定义下拉列表的渲染内容
        renderOption = {renderOption}
        // 当用户选择菜单项时触发的事件
        onSelect = {handleOnSelect}
      />
       内部的保存的状态有
      1. value，setValue 输入框的值
      2. suggestion setSuggestion 筛选后得到的值
      3. loading setLoading
      4. hightLightIndex setHightLightIndex 高亮显示项 每次请求到数据后 都要将hightLightIndex设置为-1
      ```
      
### Menu

1. Menu Props

   ```js
   defaultIndex:number 
   mode:string 模式
   onSelect?:(selectIndex:number)=>void的选择子组件后的回调函数
   
   const [currentActive,setActive] = useState(defaultIndex)
   
   需要保存激活组件的下标 将其传递给子组件
   // 需要传递给子组件的
   IMenuContext{
     index:number;
     onSelect:
   }
   ```

2. MenuItemProps

   ```js
   index:标识我是哪一个下标
   disabled 是否可用
   ```

3. 要找到渲染组件的最外层的容器 可以给最外层的容器添加一个data-testid="test-menu"

   当该组件没有text文本属性时等可以使用该方法

   ```js
    menuElement = wrapper.getByTestId('test-menu');
   ```

4. 在beforeEach中执行的代码脚本 会在每次case执行完之后自动调用cleanup()清空，在下一个case时再执行

   ```js
   beforeEach(()=>{
             wrapper = render(generateMenu(testProps));
   })
   it('',()=>{
        cleanup()清空beforeEach中执行的代码
        wrapper = render(generateMenu(testVerProps)) //会导致页面中有两个dom节点
   })
   ```

5. 限制children类型 只能是MenuItem | SubMenu

   ```js
   // 给MenuItem添加全局属性
   MenuItem.displayName = 'MenuItem'
   
   // 父组件中检查是否有该属性
    const renderChildren = ()=>{
     return  React.Children.map(children,(child,index)=>{
                 const childElement = child as FunctionComponentElement<MenuItemProps>
                 const {displayName} = childElement.type;
     if(displayName === 'MenuItem' || displayName === 'SubMenu'){
            //给虚拟的dom元素添加属性需要使用clone
            return cloneElement(childElement,{index:index.toString()})
      }
      else{
             console.error("Warning: Menu has a child which is not a MenuItem")
      }
    })}
   ```

6. 给submenu的垂直模式下 鼠标移入移除控制打开与关闭

   ```js
   这里要节流一下 当鼠标快速移入移除时，不执行移入移除函数 mouseEnter只对父元素起作用 子元素不起作用
   let timer:any
   const handleMouse = (e:React.MouseEvent,toggle:boolean)=>{
           clearTimeout(timer);
           e.preventDefault();
           timer = setTimeout(()=>{
               setOpen(toggle)
           },300)}
   const hoverEvents = context.mode!=='vertical'?{
           onMouseEnter:(e:React.MouseEvent)=>{handleMouse(e,true)},
           onMouseLeave:(e:React.MouseEvent)=>{handleMouse(e,false)}
    }:{};
   ```

7. ### 测试

   ```js
   // ：scope将是menuElement本身 查找本身下面的第一级的li标签
    expect(menuElement.querySelectorAll(':scope > li').length).toEqual(5);
   
   需要给元素添加简单的样式 可以直接给wrapper.container.append(css样式文件)
   
    该元素是否可见 通过css(visibility diplay)属性的设置控制元素的可见
    expect(wrapper.queryByText('drop1')).not.toBeVisible()
   ```

   

### 测试

jest  通用测试框架

jest-dom 添加针对Dom的断言 toBeInTheDom  toHaveClass @testing-library/jest-dom

React-Test-Library    react component挂载渲染的测试工具

​    @testing-library/react  渲染组件，对组件进行点击等事件操作 data-test 进行标识ID

```js
mock axios模块
jest.mock('axios') 由jest接管 不执行该函数
转化为一个MockAxios类型的对象 才具有get.mockResolvedValue方法
let mockedAxios = axios as jest.Mocked<typeof axios>
```

#### 匹配器

  ```js
1.真假
toBe(x)          严格相等 ===  
toEqual(x)       == 内容相等
toBeNull()       只匹配null
toBeUndefined()  只匹配undefined
toBeDefined()    只要定义过了 都可以匹配成功
toBeTruthy()     true/false匹配器
toBeFalsy()     true/false匹配器

2.数字
toBeGreaterThan(x) 大于x
toBeGreaterThanOrEqual() >=
toBeLessThan(x) 小于
toBeLessThanOrEqual()<=
toBeCloseTo(x) 浮点精度 比较相等 

3.
toMatch('x') 查看字符串中是否有某字符 expect('xlx xzx fze').toMatch('xlx') //使用正则toMatch(/xlx/)
toMatchObject(object) 查看对象的属性子集是否匹配。
toContain('x') 查看数组，set中是否匹配，使用===严格模式的匹配。
toContainEqual(item) 检查item={xx:yy} 检查的是字段属性相等否，并不是检查对象标识。
toThrow('kkopdpjfe') 检测一个方法是否抛出异常,并且抛出的异常信息为kkopdpjfe
.toHaveProperty(keyPath, value?) 检查某对象是否有某些属性，并且值是什么
// 当检测深层次属性时 keyPath [x1,x2,targetKey]使用数组


4.函数
.toHaveBeenCalled() 某函数被调用
.toHaveBeenCalledTimes(number) 某函数被调用的次数
.toHaveBeenCalledWith(arg1, arg2, ...) 某函数被调用的参数
.toHaveReturnedWith(value) 某函数的返回值是                     
  ```

#### jest不支持es 只支持commonjs

需要将import转化为require  node 

```js
jest 
中有babel-jest插件 当使用npm run test时--去检测是否有babel/core ---> 若有拿到babelrc配置文件--代码的转换
```

#### jest异步

promise     一定不要忘记把 promise 作为返回值⸺如果你忘了 `return` 语句的话，在 `fetchData` 返回的这个 promise 被 resolve、then() 有机会执行之前，测试就已经被视为已经完成了。

```js
捕获异常，但是当后台返回404时，测试用例通过
.catch(e){
  expect(e.toString.indexOf('404')>-1).toBe(true)
}
当正常时，此时测试也通过，是因为没有捕获到异常，不正确，需要自己添加断言
需要自己断言，必须执行一次expect()测试用例
expect.assertions(1)
```

aysnc await  必须await之后才能跑完测试用例

#### jest4个钩子函数

beforeAll() 在所有测试用例之前进行执行

`afterAll()`钩子函数是在完成所有测试用例之后才执行的函数。

`beforeEach()`钩子函数，是在每个测试用例前都会执行一次的钩子函数

`afterEach()`钩子函数，是在每次测试用例完成测试之后执行一次的钩子函数

describe快将测试分组，当before，after的块在describe内部时，则其只适用于该describe块内的测试

+ 作用域

  钩子函数在父级分组可作用域子集，类似继承

  钩子函数同级分组作用域互不干扰，各起作用

​       先执行外部的钩子函数，再执行内部的钩子函数

test.only()只执行这一个

#### jest Mock

只想知道该函数被正确调用即可，不必关心函数内部方法的执行过程

+ 捕获函数的调用情况

+ 设置函数的返回值

+ 改变函数的内部实现

 ```js
  jest.fn()  
  可以定义函数内部的实现，undefined作为返回值 进行某些有回调函数的测试
  jest.mock() 不需要进行实际的请求,mock的模块中的代码并不会真正的执行
  jest.spyOn() 可以捕获函数的调用情况，还可以正常的执行被spy的函数
 
  fn,spyOn()通过mock属性捕获函数
  calls------ 函数被调用返回的结果
  instances----- 函数指向的this原型
  invocationCallOrder ------ 函数执行的顺序
  results----- 函数执行的结果，为数组类型，有返回的类型和返回的值
 ```

### react-testing-library + jest

react-testing-library：渲染组件 --- wrapper

@testing-library/jest-dom：提供许多获取查询DOM元素的方法

+ 测试流程 找到dom元素，执行点击等方法

  Arrange:   编排  渲染组件 获取所需要的的DOM的不同元素  

  Act:  fireEvent 接受一个DOM节点，并触发DOM事件

  Assert：断言，触发事件通常会触发程序中的某些更改，执行一些断言来确保这些更改发生。



### 图标

@fortawesome/react-fontawesome  svg图标库 需要什么就引入什么 打包也只会打包引入的

在fontawesome组件基础上，封装出Icon组件 包含一个theme主题

```js
import {FontAwesomeIcon,FontAwesomeIconProps} from '@fortawesome/react-fontawesome';
FontAwesomeIcon 是一个容器
import {faCoffee} from '@fortawesome/free-solid-svg-icons'
faCoffe是具体的图标 是一个变量 不是一个字符串
<FontAwesomeIcon icon={faCoffee}/>
    
若想使用字符串 并且建立的一个库(放在初始化的模块中main.js) 可以批量导入所有的图标，并且只使用一次
import {library} from '@fortawesome/fontawesome-svg-core';
import {fas} from '@fortawesome/free-solid-svg-icons';
library.add(fas);  
fas是图标库所有的图标的集合
```

### 动画

```js
display:none opacity:0 不会使动画产生过渡  当display为none时，并不在render树中出现，添加样式也没作用
react-transition-group 在组件从无到有的过程中，暴露出一一系列的钩子，供我们在这些阶段编写样式 
cssTransitionGroup 子节点设置key的true/false 控制动画的进入进出 根据css样式名改变动画效果

        reflow 添加动画效果                 timeout
*-enter ----------------  *-enter-active ---------- *-enter-done
        reflow                             timeout
*-exit  ----------------  *-exit-active  ----------- *exit-done
onmountOnExit 钩子函数 当组件状态为exit时移除该包裹的子节点  不再需要使用display控制组件显示

当一个组件上具有同一个transition属性时，会产生覆盖
为了避免覆盖 可以将包裹的子组件外层添加一个div 动画属性就是添加到了外层的div容器上，与内部容器不会发生冲突
```

### 进度条

   两个div 内部div的宽度是percentage

1. 高度可配置
2. 百分比
3. 是否显示百分比文字
4. 自定义样式
5. 主题颜色

```js
export interface ProgressProps{
    percent:number;
    strokeHeight?:number;
    showText?:boolean;
    styles?:React.CSSProperties;
    theme?:ThemePros
}
```

### 上传

1. 文件上传的方式 form(mutipart/form-data)表单    js(模拟表单)异步请求发送form-data

2. application/x-www-form-urlencoded 默认的表单传送数据  是编码附加到url或者body中进行传送

​        multipart/form-data 专门为发送二进制文件而发明

3. 借助input 将其display:none 添加ref属性 虽然其元素不存在与render tree中 但是存在于DOM tree中

​       当点击button时，触发input的click属性 ref.current.click  模拟文件上传操作

4. 在文件删除 上传时 由于setFileList是异步 并不一定拿到的就是最新的值 需要使用回调函数 去获取到最新的值

   上传多文件时，也需要回调函数，不然多次post 最后只能拿到一个

5. drag         放到何处 - ondragover        进行放置 - ondrop

```js
            触发
初始状态--DragOver--添加特定class:is-dragover--DragLeave | onDrop
                                               |           |
                                        删除特定class        删除特定class,触发onFile 
```

一个文件的生命周期

```js
beforeUpload(file) 对文件验证 | 得到经过处理后的文件
onProgress(event,file)
onChange(file)---onSuccess(response,file) -- onRemove(file)点击已经上传文件的删除按钮
   |
   |
   onError(error,file)

暴露给用户 headers
name 上传文件的名字
form-data属性，允许用户在上传文件时 携带一些自定义的参数 如token
input 限制文件类型accept 选择多文件mutipul
post过程中，默认不携带cookie 可配置参数 withCredentials:true

自定义触发的元素
支持拖动上传
上传文件 添加onPreView预览事件

<Upload
   action="https://upload",
   beforeUpload = {}
   onProgress = {}
   onChange = {}
   onSuccess = {}
   onError = {}
   onRemoved = {}
> <Button> Click to upload</Button> </Upload>
```

### 配置ts

1. 配置将ts编译为js时，js   import vue from 'vue' 去node_modules模块中查找 但是ts模块的查找方式不一样

​       需要添加 "moduleResolution":"node", 使其模块查找方式一致

2. ts默认不支持import default配置 import React from 'react'  import * as React from 'react' 需要开启

​       "allowSyntheticDefaultImports": true,

3. webpack 打包主流是单入口文件，在入口文件中引入其他文件 module bundle

​       umd 无法按需导入 会一次性导入全部的文件

4. 打包组件库 用户可以引入样式文件 按需引入需要的组件 打包为es6 module 

5. 创建入口文件

   main:commonjs 模块入口文件

   module：es6模块的入口文件路径 

   types typescript的入口文件 .d.ts 开发提示文件入口

   为了启用tree-shaking以及按需导入  export xxx方式导出 

   ```js
   拿到模块的default字段 重命名为Button 类似于 export Button from 'xxxxx' 
   引入时 可以直接使用import {Button} from 'index.js'模式引入
   
   export {default as Button} from './components/Button'
   ```

6. 组件库本地链接测试

    

 

### storyBook

根据story生成ui组件的页面

1. 安装 配置能支持的ts的文件后缀 webpack.config.js配置loader

2. 引入全局的样式 在preview.js中引入 

3. 引入插件 addons

   ```js
   addon-actions 记录组件的行为
   
   使用decorator方式 
   是一个容器 可以在配置文件中引入，给所有的story外层包裹一个容器
   addDecorator(storyWrapper)
   
   引入文档
   用于 story 信息展示，包含当前展示的组件的源代码（实时更新），当前组件 propTypes 说明（详细）
   addDecorator(withInfo) 引入插件
   addParameters({info: { inline: true, header: false}}) 配置插件的参数
   
   文档生成器 react-docgen 可以分析组件传入的参数并以表格的形式显示props    
   添加注释添加到表格中 JSDOC注释 支持复杂的markerdown文档 ```js``` ## 
    shouldExtractLiteralValuesFromEnum: true, 展开枚举的类型
    propFilter: (prop) => {
      if (prop.parent) { // 过滤掉原生的属性
          return !prop.parent.fileName.includes('node_modules')
       }
          return true            
    }
   ```

### react hook渲染

capture value

在每次render时都有自己的Props与State  每次渲染期间 都是隔离的

每次render的内容都会形成一个快照并保留下来，因此当状态变更时而rerender时，就形成了N个快照，每个快照都保留着自己拥有的固定不变的Props与State 与方法

useEffect也具有该特性 回收机制 在组件被销毁时，会执行返回值的回调函数，由于CV,每次注册回收拿到的都是成对的固定值

useRef 它的值的改变不会引起组件渲染，并且只有一份值，在组件的渲染之间不存在隔离的问题

获取组件实例对象 跨渲染周期保存数据

useCallback对函数进行缓存，防止总是重复的生成新的函数

```js
避免遗漏依赖 必须将函数写在useEffect内部 
useEffect(() => {
    function getFetchUrl() {
      return "https://v?query=" + count;
    }
    getFetchUrl();
  }, [count]);
不利于维护
将函数抽离出去 useCallback还会缓存函数，只有当依赖的值发生了变化 才会去重新生成函数 这样才会重新执行effect
 const getFetchUrl = useCallback(() => {
    return "https://v?query=" + count;
  }, [count]);
  useEffect(() => {
    getFetchUrl();
  }, [getFetchUrl]);

以上会造成两个值以改变 就会产生大量的函数实例化,使用useRef将useCallBack的依赖值为不变，每次拿到最新的值，但是依赖改变并不会产生大量的函数实例，不推荐使用，使用reducer黑魔法
function useEventCallback(fn,dependencies){
   const ref = uesRef(null)
   useEffect(()=>{
       ref.current = fn
   },[fn,dependencies])
    return useCallback(()=>{
        const fn = ref.current
        return fn()
    },[ref])
}
```

useMemo缓存计算结果 当依赖没有发生变化时，不执行计算,直接返回缓存结果

```js
局部的PureRender
将返回的渲染函数包裹起来 渲染函数依赖于props.fetchData 即使prop发生了变化 但是fetchData没有变就不会重新渲染
const Child = (props) => {
  useEffect(() => {
    props.fetchData()
  }, [props.fetchData])

  return useMemo(() => (
    // ...
  ), [props.fetchData])
}
```

useContext 与connect类似 只传入想要的数据 只依赖想要的数据的变化

```js
const Count = () => {
  const { state, dispatch } = useContext(Store);
  return useMemo(
    () => (
      <button onClick={() => dispatch("incCount")}>
        incCount {state.count}
      </button>
    ),
    [state.count, dispatch]
  );
};
const Step = () => {
  const { state, dispatch } = useContext(Store);
  return useMemo(
    () => (
      <button onClick={() => dispatch("incStep")}>incStep {state.step}</button>
    ),
    [state.step, dispatch]
  );
};
```

精读文章   https://www.cnblogs.com/ascoders/p/10928931.html

useReducer() 将数据与函数解耦

```js
useEffect(() => {
    const id = setInterval(() => {
      dispatch({ type: "tick" });
    }, 1000);
    return () => clearInterval(id);
  }, [dispatch]);
使其useEffect依赖的数据 变为依赖dispatch函数 这样就不会一直销毁产生计时器
```

