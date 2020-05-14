import React from 'react'
import { CSSTransition } from 'react-transition-group'
import { CSSTransitionProps } from 'react-transition-group/CSSTransition';
// react-transition-group 并没有添加任何复杂的样式 只是在组件从出现到消失之间暴露出一系列的类名
// 供自己添加想要的样式
// *-enter  --强制发起一次reflow 添加动画效果--   *-enter-active

export type AnimationName = 'zoom-in-top' | 'zoom-in-left' | 'zoom-in-bottom' | 'zoom-in-right'

//这里使用type，不能使用interface，interface不能继承具有联合类型的type/interface
 type TransitionProps  =  CSSTransitionProps  & {
  animation?: AnimationName,
  wrapper?:boolean
 }

const Transition: React.FC<TransitionProps> = (props) => {
  const {
    children,
    classNames,
    animation,
    wrapper,
    ...restProps
  } = props;
  return (
    <CSSTransition
      classNames = { classNames ? classNames : animation}
      {...restProps}
    >
      {/* 为了不让其的过渡效果影响到其他节点 */}
      {wrapper ? <div>{children}</div> : children}
      
    </CSSTransition>
  )
}
Transition.defaultProps = {
  unmountOnExit: true,
  appear: true,
}

export default Transition