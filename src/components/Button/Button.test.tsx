import React from 'react'
import {render,fireEvent} from '@testing-library/react'
import Button,{ButtonProps} from './button'

const defaultProps = {
    //创建一个mock函数，返回为undefined
    onClick:jest.fn()
}

const testProps:ButtonProps={
    btnType:'primary',
    size:'lg',
    className:'klass'
}

const disabledProps: ButtonProps = {
    disabled: true,
    onClick: jest.fn(),
  }

test('our first react test case',()=>{
    //将button组件建渲染到真实的节点上
    const wrapper = render(<Button>Nice</Button>);
    //是否找到节点 没有找到 则返回null
    const element = wrapper.queryByText('Nice');
    //会将element强制转化为boolean值与true做比较-
    expect(element).toBeTruthy();
})

describe('test Button Component',()=>{
    it('should render the correct default button',()=>{
        const wrapper = render(<Button {...defaultProps}>Nice</Button>);
        //没有找到则直接返回报错
        const element = wrapper.getByText('Nice') as HTMLButtonElement;
        //是否出现在文档流中
        expect(element).toBeInTheDocument();
        //是否是个button
        expect(element.tagName).toEqual('BUTTON');
        //是否具有默认的样式名
        expect(element).toHaveClass('btn btn-default');
        expect(element.disabled).toBeFalsy();
        //点击该元素
        fireEvent.click(element);
        //判断该函数是否被点击
        expect(defaultProps.onClick).toHaveBeenCalled();

    });
    it('should render the correct component based on different props',()=>{
        const wrapper = render(<Button {...testProps}>Nice</Button>);
        const element = wrapper.getByText('Nice');
        expect(element).toBeInTheDocument();
        expect(element).toHaveClass('btn-primary btn-lg klass')

    });
    it('should render a link when btnType equals link and href is provided',()=>{
        const wrapper = render(<Button btnType='link' href='http://www.baidu' >Link</Button>);
        const element = wrapper.getByText('Link');
        expect(element).toBeInTheDocument();
        expect(element.tagName).toEqual('A')
        expect(element).toHaveClass('btn btn-link')
    });
    it('should render disabled button when disabled set to true',()=>{
        const wrapper = render(<Button {...disabledProps}>Nice</Button>);
        const element = wrapper.getByText('Nice') as HTMLButtonElement;
        expect(element).toBeInTheDocument();
        expect(element.disabled).toBeTruthy();
        fireEvent.click(element);
        expect(disabledProps.onClick).not.toHaveBeenCalled();
    })

})