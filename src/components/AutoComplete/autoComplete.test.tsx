import React from 'react';
import AutomComplete,{AutoCompleteProps, AutoComplete,DataSourceType} from './autoComplete';
import {render, RenderResult, fireEvent,waitFor, cleanup} from '@testing-library/react';
import {config} from 'react-transition-group'

//让所有异步动画都变为同步
//禁用过渡非常有用，这样它们就不会使测试复杂化，也不会引入任意等待
config.disabled = true;

//只运行一个测试用例
// npm test -- -t "测试组件名称--可以只写一半auto"

const testArray = [
    {value:'ab',number:11},
    {value:'abc',number:1},
    {value:'b',number:4},
    {value:'c',number:15}
]
interface GithubUserProps{
    login:string;
    url:string;
    avatar_url:string;
}
const testProps:AutoCompleteProps = {
    fetchSuggestion:(query:string)=>{return testArray.filter(item=>item.value.includes(query))},
    onSelect:jest.fn(),
    placeholder:'auto-complete'
}

interface LakerPlayProps {
    value:string;
    number?:number
}

const renderGitOption = (item:DataSourceType)=>{
    const itemWithGithub = item as DataSourceType<GithubUserProps>;
    return (
        <div title="render">
            <h2>Name:{itemWithGithub.login}</h2>
            <h4>url:{itemWithGithub.url}</h4>
        </div>
    
    )
}

const renderOption = (item:LakerPlayProps)=>{
    const itemt = item as DataSourceType<LakerPlayProps>;
    return (
        <>
            <h2>Name:{itemt.value}</h2>
            <h4>url:{itemt.number}</h4>
        </>
    
    )
}

let wrapper:RenderResult,inputNode:HTMLInputElement;
describe('test AutoComplete Component',()=>{
    beforeEach(()=>{
        wrapper = render(<AutoComplete  {...testProps}/>)
        //queryByPlaceholderText是jest-dom提供的函数
        inputNode = wrapper.queryByPlaceholderText('auto-complete') as HTMLInputElement
    })
    afterEach(cleanup)
    test('test basic AutoComplete behavior',async ()=>{
        fireEvent.change(inputNode,{target:{value:"a"}});
        await waitFor(()=>expect(wrapper.queryByText('ab')).toBeInTheDocument())
        //wrapper.container是一个包含autoComplete组件的div 就是一个普通的htmlElement元素，可以使用查询id等函数
        expect(wrapper.container.querySelectorAll(".suggestion-item").length).toEqual(2);
        fireEvent.click(wrapper.getByText('ab'));
        //该方法执行时的参数
        expect(testProps.onSelect).toHaveBeenCalledWith({value:'ab',number:11})
        expect(inputNode.value).toBe('ab');
    })
    it('should provide keyboard support',async ()=>{
        fireEvent.change(inputNode,{target:{value:"a"}});
        await waitFor(()=>expect(wrapper.queryByText('ab')).toBeInTheDocument());
        const firstResult = wrapper.queryByText('ab');
        const secondResult = wrapper.queryByText('abc');

        fireEvent.keyDown(inputNode,{keyCode:40});
        expect(firstResult).toHaveClass('is-active');
        fireEvent.keyDown(inputNode,{keyCode:40});
        expect(secondResult).toHaveClass('is-active');
        fireEvent.keyDown(inputNode,{keyCode:38});
        expect(firstResult).toHaveClass('is-active');

        fireEvent.keyDown(inputNode,{keyCode:13});
        expect(testProps.onSelect).toHaveBeenCalledWith({value:'ab',number:11})
        expect(wrapper.queryByText('ab')).not.toBeInTheDocument();
    
    })
    it('click outside should hide the dropdown',async ()=>{
        fireEvent.change(inputNode,{target:{value:"a"}});
        await waitFor(()=>expect(wrapper.queryByText('ab')).toBeInTheDocument());
        fireEvent.click(document);
        expect(wrapper.queryByText('ab')).not.toBeInTheDocument();
    })
    
    it('renderOption should generate the right template',async ()=>{  
        // wrapper = render(<AutoComplete renderOption={renderOption} {...testProps}/>)
        // //queryByPlaceholderText是jest-dom提供的函数
        // inputNode = wrapper.queryByPlaceholderText('auto-complete') as HTMLInputElement
        // fireEvent.change(inputNode,{target:{value:"a"}});
        // await waitFor(()=>expect(wrapper.container.querySelectorAll('h2').length).toEqual(2));
    })
    it('async fetch suggestion should works fine',async()=>{
      
        // fireEvent.change(inputNode,{target:{value:"a"}});
        // await waitFor(()=>expect(wrapper.container.querySelectorAll('h2').length).toEqual(2));
    })
})