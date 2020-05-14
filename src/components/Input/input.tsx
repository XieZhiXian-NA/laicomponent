import React,{InputHTMLAttributes, ReactElement, FC, ChangeEvent}from 'react';
import {IconProp} from '@fortawesome/fontawesome-svg-core';
import classNames from 'classnames'
import Icon from '../Icon/icon';

type InputSize = 'lg' | 'sm';

export interface InputProps extends  Omit<InputHTMLAttributes<HTMLElement>,'size'>{
    /**是否禁用 Input */
    disabled?:boolean;
    /**添加图标，在右侧悬浮添加一个图标，用于提示 */
    icon?:IconProp;
    /**添加前缀 用于配置一些固定的组合 */
    prepend?:string | ReactElement;
    /**添加后缀 用于配置一些固定的组合 */
    append?:string | ReactElement;
     /**设置 input 大小，支持 lg 或者是sm */
    size?:InputSize;
    onChange?:(e:ChangeEvent<HTMLInputElement>)=>void;

}
/**
 * Input 输入框 通过鼠标或键盘输入内容，是最基础的表单域的包装
 * ~~~js
 * import {Input} from 'laicomponent'
 * ~~~
 * 支持 HTMLInput 的所有属性
 * 
 */
export const Input:FC<InputProps> = (props)=>{
    const {icon,size,disabled,prepend,append,style,...restProps} = props;
    const inputClass = classNames('lai-input-wrapper',{
        [`input-size-${size}`]:size,
        'is-disabled':disabled,
        'input-group':prepend || append,
        'input-group-append': !!append,
        'input-group-prepend':!!prepend
    }) 
    //为了防止非受控组件value值从undefined/null 变为受控组件 
     const fixControlledValue = (value:any)=>{
         if(typeof value === 'undefined' || value === null)
            return ''
        return value
     }

    if('value' in props){
        //defaultValue 与 value值只能存在一个
        delete restProps.defaultValue
        restProps.value = fixControlledValue(props.value)
    }
 
    return (
        <div className={inputClass} style={style}>
            {prepend && <div className="lai-input-group-prepend">{prepend}</div>}
            {icon && <div className="icon-wrapper"><Icon icon={icon} title={`title-${icon}`}/></div>}
            <input className="lai-input-inner" disabled={disabled} {...restProps}/>
            {append && <div className="lai-input-group-append">{append}</div>}
        </div>
    )
}
export default Input;