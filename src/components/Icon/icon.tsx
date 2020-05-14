import React ,{FC}from 'react';
import classNames from 'classnames';
import {FontAwesomeIcon,FontAwesomeIconProps} from '@fortawesome/react-fontawesome';
export type ThemePros = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'light' | 'dark'
export type  IconProps =  FontAwesomeIconProps &{
    theme?:ThemePros;
    className?:string
}
export const Icon:FC<IconProps> = (props)=>{
    const {className,theme,...resetProps} = props
    const classes = classNames('lai-icon',className,{
        [`icon-${theme}`]:theme
    })
    return (
        <FontAwesomeIcon className={classes} {...resetProps}/>
    )
}
export default Icon;