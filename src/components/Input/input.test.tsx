import React from 'react';
import {Input,InputProps} from './input'
import { RenderResult,render, fireEvent } from '@testing-library/react'


const defaultProps:InputProps={
    onChange:jest.fn(),
    placeholder:'test-input'
}

describe('test Input Component',()=>{
    it('should render the correct default Input',()=>{
       const wrapper = render(<Input {...defaultProps} />) 
       const testNode = wrapper.getByPlaceholderText('test-input') as HTMLInputElement;
       expect(testNode).toBeInTheDocument();
       expect(testNode).toHaveClass('lai-input-inner');
       fireEvent.change(testNode,{target:{value:"23"}}); 
       expect(defaultProps.onChange).toHaveBeenCalled();
       expect(testNode.value).toEqual('23')
    })
    
    it('should render the disabled Input on disabled property',()=>{
        const wrapper = render(<Input {...defaultProps} disabled placeholder="disabled" />) 
        const testNode = wrapper.getByPlaceholderText('disabled') as HTMLInputElement;
        expect(testNode.disabled).toBeTruthy();
    })

    it('should render diffent input sizes on size property',()=>{
        const wrapper = render(<Input size="lg"  placeholder="sizes" />);
        const testContainer = wrapper.container.querySelector('.lai-input-wrapper')
        expect(testContainer).toHaveClass('input-size-lg')
    })

    it('should render prepend and append element on prepand/append property',()=>{
        const {queryByText,container} = render(<Input prepend="https://" append=".com" placeholder="prepand/append" />)
        const testContainer = container.querySelector('.lai-input-wrapper');
        expect(testContainer).toHaveClass('input-group input-group-append input-group-prepend');
        expect(queryByText('https://')).toBeInTheDocument();
        expect(queryByText('.com')).toBeInTheDocument();
   
   
    })
})