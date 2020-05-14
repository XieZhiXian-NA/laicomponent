import React ,{FC,useRef,useState, ChangeEvent, Children}from 'react'
import axios from 'axios';

import Button from '../Button/button';
import UploadList from './uploadList';
import Dragger from './dragger';

type UploadFileStatus = 'ready' | 'uploading' | 'success' | 'error'

export interface UploadFile {
    uid:string;
    size:number;
    name:string;
    status?:UploadFileStatus;
    percent?:number;
    raw?:File;
    response?:any;
    error?:any;
}
export interface UploadProps {
    action:string;
    defaultFileList?:UploadFile[];
    beforeUpload?:(file:File)=>boolean | Promise<File>;
    onProgress?:(percentage:number,file:File)=>void;
    onSuccess?:(data:any,file:File)=>void;
    onError?:(err:any,file:File)=>void;
    onChange?:(file:File)=>void;
    onRemove?:(file:UploadFile)=>void;
    headers?:{[key:string]:any};
    name?:string;
    data?:{[key:string]:any};
    withCredentials?:boolean;
    accept?:string;
    multiple?:boolean;
    drag?:boolean
}

export  const Upload:FC<UploadProps> = (props)=>{
    const {   
        action,
        defaultFileList,
        beforeUpload,
        onProgress,
        onSuccess,
        onError,
        onChange,
        onRemove,
        headers,
        name,
        data,
        withCredentials,
        accept,
        multiple,
        children,
        drag
    } = props;
     const fileInput = useRef<HTMLInputElement>(null);
     const [fileList,setFileList] = useState<UploadFile[]>(defaultFileList || []);

    const updateFileList = (uploadFile:UploadFile,updateObj:Partial<UploadFile>)=>{
        setFileList(prevList=>{
            return prevList.map(file=>{
                if(file.uid === uploadFile.uid){
                    return {...file,...updateObj}
                }else{
                    return file
                }
            })
        })
    }

     const handleClick = ()=>{
         //模拟input的文件click上传文件事件
         if(fileInput.current) fileInput.current.click()
     } 
     const post = (file:File)=>{

         let _file:UploadFile = {
             uid:Date.now()+'upload-file',
             status:'ready',
             name:file.name,
             size:file.size,
             percent:0,
             raw:file
         }
         //异步 保证当上传多个文件时不会覆盖
         setFileList(prevList=>{
             return [_file,...prevList]
         })

        const formData = new FormData();
        formData.append(name || 'file',file);
        if(data){
            Object.keys(data).forEach(key=>{
                formData.append(key,data[key])
            })
        }
        axios.post(action,formData,{
          headers:{
             ...headers,
            'Content-Type': 'multipart/form-data'
          },
          withCredentials:withCredentials,
          onUploadProgress:(e)=>{
             let percentage = Math.round((e.loaded*100)/ e.total) || 0;
             if(percentage < 100) {
                 updateFileList(_file,{percent:percentage,status:'uploading'})
                 if(onProgress){
                     onProgress(percentage,file);
                 }
                
             }
          }
        })
        .then(res=>{
            updateFileList(_file,{status:'success',response:res.data})
            onSuccess && onSuccess(res.data,file);
            onChange && onChange(file);
        })
        .catch(err=>{ 
            updateFileList(_file,{status:'error',error:err})
            onError &&  onError(err,file);
            onChange && onChange(file);
            console.error(err);
           
        })
        
     }
      const uploadFiles = (files:FileList)=>{
        let postFiles = Array.from(files);
        postFiles.forEach( file=>{
            if(!beforeUpload){
                post(file)
            }   
             else{
                  const result = beforeUpload(file);
                  if(result && result instanceof Promise){
                      result.then(processedFile=>{
                          post(processedFile)
                      })
                  }else if(result !== false){
                      post(file)
                  }
             }
        }
        )
     }
     const handleFileChange =  (e:ChangeEvent<HTMLInputElement>)=>{
        const files = e.target.files;
        if(!files) return;
        uploadFiles(files)
        if(fileInput.current) fileInput.current.value = ''
     }

     const handleRemove = (file:UploadFile)=>{
         setFileList((prevList)=>{
            return prevList.filter(item=>item.uid !== file.uid)
         })
         onRemove && onRemove(file);
     }
    return (
        <div className="lai-upload-component">
          {/* <Button btnType="primary"
                onClick={handleClick}
                >UploadFile
          </Button> */}
          <div className="lai-upload-input" style={{display:'inline-block'}}
            onClick={handleClick}
          >
             {  drag ? <Dragger
                onFile={(files)=>{ uploadFiles(files)}}
             >{children}</Dragger> :children}
             <input ref={fileInput} type="file" 
                className={"lai-file-input"} 
                style={{display:'none'}}
                onChange = {handleFileChange}
                accept={accept}
                multiple={multiple}
               />
                <UploadList
                    fileList={fileList}
                    onRemove={handleRemove}
                />
          </div>
         
         
        </div>
    )
}
Upload.defaultProps={
    name:'file'
}

export default Upload;