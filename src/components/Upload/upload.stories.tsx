import React from 'react';
import {storiesOf} from "@storybook/react";
import Upload,{UploadFile}from './upload';
import { action } from '@storybook/addon-actions';
import Icon from '../Icon/icon';

const defaultFileList: UploadFile[] = [
  { uid: '123', size: 1234, name: 'hello.md', status: 'uploading', percent: 30 },
  { uid: '122', size: 1234, name: 'xyz.md', status: 'success', percent: 30 },
  { uid: '121', size: 1234, name: 'eyiha.md', status: 'error', percent: 30 }
]



// const checkFile = (file:File)=>{
//        if(Math.round(file.size/1024)>50){
//            alert('file to big')
//           return false
//        }
//        return true
// }
// const filePromise = (file:File)=>{
//     const newFile = new File([file],'new_name.docx',{type:file.type});
//     return Promise.resolve(newFile);
// }
const SimpleUpload = ()=>{
    return (
        <Upload 
        action="http://jsonplaceholder.typicode.com/posts"
        onProgress = {action('progress')}
        onSuccess={action('success')}
        onError={action('error')}
        // beforeUpload={checkFile}
        onChange={action('changed')}
        defaultFileList = {defaultFileList}
        onRemove={action('remove')}
        name='filename'
        data={{'key':'value'}}
        headers={{'X-Powered-By':"lai"}}
        accept='.jpg'
        multiple
        drag={true}
        >

            <Icon icon="upload" size="5x" theme="secondary"/>
            <br/>
            <p>Drag file over to upload</p>
    
        </Upload>
    )
}

storiesOf('Upload Component',module)
.add('上传文件 load file',SimpleUpload)
