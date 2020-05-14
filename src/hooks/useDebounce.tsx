import {useState,useEffect} from 'react'
function useDebounce(value:any,delay=300){
     const [debounceValue,setDebounceValue] = useState(value);
     useEffect(() => {
       const handler = window.setTimeout(()=>{
            setDebounceValue(value)
       },delay);
       return ()=>{
           clearTimeout(handler)
       }
    //不用计算时间的延迟，当value改变时，直接就清除上一次的timeOut
    //当用户的输入停止为300s后，才触发set函数
     },[value,delay] )
     return debounceValue
}
export default useDebounce;
