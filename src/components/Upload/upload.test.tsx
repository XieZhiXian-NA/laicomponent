import React from 'react';
import {render, RenderResult} from '@testing-library/react';
import Upload,{UploadProps} from './upload'
import { fireEvent, waitFor } from '@testing-library/dom';
import axios from 'axios';

jest.mock('../Icon/icon',()=>{
    return ({icon,onClick})=>{
        return <span onClick={onClick}>{icon}</span>
    }
})

jest.mock('axios')
const mockAxios = axios as jest.Mocked<typeof axios>;

const testProps:UploadProps = {
    action:"fakeurl.com",
    onSuccess:jest.fn(),
    onChange:jest.fn(),
    onRemove:jest.fn(),
    drag:true
}

let wrapper:RenderResult,fileInput:HTMLInputElement,uploadArea:HTMLElement;
const testFile = new File(['xyz'],'test.png',{type:"image/png"})

describe('test upload component',()=>{
    beforeEach(()=>{
        wrapper = render(<Upload {...testProps}>click upload file</Upload>)
        fileInput = wrapper.container.querySelector('.lai-file-input') as HTMLInputElement;
        uploadArea = wrapper.getByText('click upload file');
    })
    it('upload process should works fine',async ()=>{
        const {queryByText} = wrapper;
        // mockAxios.post.mockImplementation(()=>{
        //     return Promise.resolve({'data':'cool'})
        // })
        mockAxios.post.mockResolvedValue({'data':'cool'});
        expect(uploadArea).toBeInTheDocument();
        expect(fileInput).not.toBeVisible();
        fireEvent.change(fileInput,{target:{files:[testFile]}});
        expect(queryByText('spinner')).toBeInTheDocument();
        await waitFor(()=>{
            expect(queryByText('test.png')).toBeInTheDocument();
        })
        expect(queryByText('check-circle')).toBeInTheDocument();
        expect(testProps.onSuccess).toHaveBeenCalledWith('cool',testFile);
        expect(testProps.onChange).toHaveBeenCalledWith(testFile);

        expect(queryByText('times')).toBeInTheDocument();
        fireEvent.click(queryByText('times') as HTMLLIElement);
        expect(queryByText('test.png')).not.toBeInTheDocument();
        //当测试的参数含有复杂的类型，只需要检测其中的几个值时，使用expect.objectContaining({})
        //包含需要测试的额参数
        expect(testProps.onRemove).toHaveBeenCalledWith(
            expect.objectContaining({
                raw:testFile,
                status:"success",
                name:'test.png'
            })
        )
    })
    it('drag and drop files should works fine',async ()=>{
        const {queryByText} = wrapper;
        fireEvent.dragOver(uploadArea);
        expect(uploadArea).toHaveClass('is-dragover');
        fireEvent.dragLeave(uploadArea);
        expect(uploadArea).not.toHaveClass('is-dragover');

        fireEvent.drop(uploadArea,{
            dataTransfer:{files:[testFile]}
        })
        await waitFor(()=>{
            expect(queryByText('test.png')).toBeInTheDocument();
        })
        expect(queryByText('check-circle')).toBeInTheDocument();
    })
})