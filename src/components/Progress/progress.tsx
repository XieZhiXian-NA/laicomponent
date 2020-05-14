import React,{FC} from 'react';
import {ThemePros} from '../Icon/icon'
export interface ProgressProps{
    percent:number;
    strokeHeight?:number;
    showText?:boolean;
    styles?:React.CSSProperties;
    theme?:ThemePros

}
export const Progress:FC<ProgressProps>=(props)=>{
    const {
        percent,
        strokeHeight,
        showText,
        styles,
        theme,
    } = props;
    return (
       <div className="lai-progress-bar" style={styles}>
            <div className="lai-progress-bar-outer" style={{height:`${strokeHeight}px`}} >
                <div className={`lai-progress-bar-inner color-${theme}`}
                  style={{width:`${percent}%`}}
                >
                {showText && <span className="inner-text">{`${percent}%`}</span>}
                </div>
            </div>
       </div>
    )
}

Progress.defaultProps = {
    strokeHeight:15,
    theme:"primary",
    showText:true,
}
export default Progress;