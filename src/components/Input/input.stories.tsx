import React,{useState}from 'react';
import Input from './input'
import {storiesOf} from '@storybook/react'
import { action } from '@storybook/addon-actions';

const ControlledInput = ()=>{
  const [value,setValue] = useState('');
  return (
    <Input value = {value}  onChange={(e)=>setValue(e.target.value )} placeholder="受控组件"></Input>
  ) 
}


const defaultInput = ()=>(
  <div>
  <Input
   style={{width:'300px'}}
   placeholder="placeholder"
   onChange = {action('changed')}
  />
  <ControlledInput/>
  
  </div>
  
)
  


const disabledInput = () => (
    <Input
      style={{width: '300px'}}
      placeholder="disabled input"
      disabled 
    />
  )

const iconInput = ()=>( 
   <Input  
      style={{width:'300px'}}
      placeholder='input with icon'
      icon="search"
    />)
   
const sizeInput = ()=>{
    return(
        <div>
     <Input
      size='lg'
      style={{width:'300px'}}
     />
     <Input
      size="sm"
      style={{width:'300px'}}
     />
    </div>
    )
}
const pandInput = ()=>(
  <div>
    <Input style={{width:'300px'}}
      defaultValue = 'prepend text'
      prepend="https://"
    ></Input>

    <Input
      style={{width:"300px"}}
      defaultValue='google'
      append=".com"
    />
  </div>
)

storiesOf('Input Component',module)
.add('Input',disabledInput)
.add('默认 Input',defaultInput)
.add('带图标的 Input',iconInput)
.add('大小不同 Input',sizeInput)
.add('带前后缀的图标',pandInput)