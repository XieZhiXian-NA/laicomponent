import React from 'react';
import {storiesOf} from '@storybook/react'
import {action} from '@storybook/addon-actions';
import Button  from './button'


const defaultButton = () => (
    <Button onClick={action('clicked')}> default button </Button>
  )

const buttonWithSize = () => (
    <div>
      <Button size="lg"> large button </Button>
      <Button size="sm"> small button </Button>
    </div>
  )

  const buttonWithType = () => {
      return (
           <div>
            <Button btnType="default"> default button </Button>
            <Button btnType="primary"> primary button </Button>
            <Button btnType="danger"> danger button </Button>
            <Button btnType="link" href="https://google.com"> link button </Button>
           </div>
      )
  }
  //module热更新
storiesOf('Button Component',module)
.add('Button', defaultButton)
//第三个参数 单独配置每个story的样式文件
.add('Button尺寸',buttonWithSize)
.add('Button样式',buttonWithType)


// info:{
//     // 支持模板字符串
//     // 支持markdown语法
//     // 支持js语法 ~~~js  ~~~
//     text:`
//      this is a very nice Component
//      ## this is a header
//      ~~~js 
//      const a = 'hello' 
//      ~~~
//     `,
//     //不用显示show Dialog
//     inline:true
// }