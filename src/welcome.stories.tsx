import React from 'react';
import {storiesOf} from '@storybook/react';
storiesOf('Welcome page',module)
.add('welcome',()=>{
    return(
        <div>
            <h1>欢迎来到 laicomponent 组件库</h1>
            <p>laicomponent 是使用 ts + react 并使用一系列hooks实现的组件库</p>
            <h3>安装试试</h3>
            <code>
                npm install laicomponent --save
            </code>
        </div>
    )
},{
    info:{
        disable:true
    }
})