import React,{FC,ButtonHTMLAttributes,AnchorHTMLAttributes}from 'react';
import classnames from 'classnames'
import { UploadProps } from '../Upload/upload';
export type ButtonSize = 'lg' | 'sm'

export type ButtonType =  'primary' | 'default' | 'danger' | 'link'


interface BaseButtonProps{
    className?:string,
    /**
     * 设置 Button 的禁用
     */
    disabled?:boolean,
    /**
     * 设置 Button 的尺寸
     */
    size?:ButtonSize,
    /**
     * 设置 Button 的类型
     */
    btnType?:ButtonType,
    children:React.ReactNode,
    href?:string
}

//button的属性
type NativeButtonProps = BaseButtonProps & ButtonHTMLAttributes<HTMLElement>;
//a链接的属性
type AnchorButtonProps = BaseButtonProps & AnchorHTMLAttributes<HTMLElement>

//将所有属性设置为可选的
export type ButtonProps = Partial<NativeButtonProps & AnchorButtonProps>;

//l两者的源码
// type Readonly<T> = {
//     readonly [P in keyof T]: T[P];
// }
// type Partial<T> = {
//     [P in keyof T]?: T[P];
// }

/**
 *页面中最常用的按钮元素，适合于完成特定的交互
 * ### 引用方法
 * 
 * ~~~js
 * import { Button } from 'laicomponent'
 * ~~~ 
 */

export const Button:FC<ButtonProps> = (props)=>{
    const {btnType,size,disabled,className,children,href,...restProps} = props;
     
    // 必须有一个btn btn-lg,btn-primary
    const classes = classnames('btn', className,{
        [`btn-${btnType}`]:btnType,
        [`btn-${size}`]:size,
        'disabled':(btnType=== 'link') && disabled
    })
   if(btnType==='link' && href ){
       return (
           <a 
             href={href}
             className={classes}
             {...restProps}
           >
               {children}
           </a>
       )
   }else{
       return(
       <button 
         className={classes}
         disabled={disabled}
         {...restProps}
       >{children}</button>
       )
   }
}
Button.defaultProps = {
    disabled:false,
    btnType:'default'
}

export default Button;