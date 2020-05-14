import React,{FC,useState,ChangeEvent, ReactElement,useEffect,KeyboardEvent,useRef} from 'react';
import Input,{InputProps} from '../Input/input';
import Icon from '../Icon/icon'
import  useDebounce from '../../hooks/useDebounce'
import useClickOutside from '../../hooks/useClickOutside'
import classNames from 'classnames'
import Transition from '../Transition/transition'
interface DataSourceObject{
    value:string;
}
//交叉类型
export type DataSourceType<T = {}> = T & DataSourceObject;

export interface AutoCompleteProps extends Omit<InputProps,'onSelect'> {
    fetchSuggestion:(str:string)=>DataSourceType[] | Promise<DataSourceType[]>;
    onSelect?:(str:DataSourceType)=>void;
    renderOption?:(item:DataSourceType)=>ReactElement;
}
/**
 * 
 * input输入框的动态查询下拉框功能，支持同步和异步
 */
export const AutoComplete:FC<AutoCompleteProps> = (props)=>{
    const { fetchSuggestion,onSelect,value,renderOption,...restProps} = props;
    const [inputValue,setInputValue] = useState(value as string);
    const [suggestions,setSuggestions] = useState<DataSourceType[]>([]);
    const [loading,setLoading] = useState(false);
    const [ showDropdown, setShowDropdown] = useState(false)
    const debounceValue = useDebounce(inputValue,500);
    const [highLightIndex,setHighLightIndex] = useState(-1);
    const triggerSearch = useRef(false);
    const componentRef = useRef<HTMLDivElement>(null);

    useClickOutside(componentRef,()=>{
        setSuggestions([])
    })
    useEffect(() => {
        if(debounceValue && triggerSearch.current){
            setSuggestions([])
            const results = fetchSuggestion(debounceValue);
            if(results instanceof Promise){
                setLoading(true)
                results.then((data)=>{
                  setLoading(false)
                   setSuggestions(data)
                   if (data.length > 0) {
                    setShowDropdown(true)
                  }
                })
            }else{
                 setSuggestions(results)
                 if(results.length>0){
                    setShowDropdown(true)
                 }
            }
        }else{
            setShowDropdown(false)
        }
        setHighLightIndex(-1);
    }, [debounceValue,fetchSuggestion])
    const handleChange =  (e:ChangeEvent<HTMLInputElement>)=>{
      const value = e.target.value.trim();
      setInputValue(value);
      triggerSearch.current = true;
    }
    const handleSelect = (item:DataSourceType)=>{
       setInputValue(item.value);
       setShowDropdown(false);
       if(onSelect){
           onSelect(item)
       }
       triggerSearch.current = false;
    }
    const renderTemplate = (item:DataSourceType)=>{
        return renderOption ? renderOption(item) : item.value
    }
    const generateDropdown = ()=>{
        return (

            <Transition
              in={showDropdown || loading}
              animation="zoom-in-left"
              timeout={300}
              onExited={()=>setSuggestions([])}
            > 
            <ul className="lai-suggestion-list">
                { loading && <div className="suggestions-loading-icon"><Icon icon="spinner" spin/></div>}
                {
                suggestions.map((item,index)=>{
                    const cnames = classNames('suggestion-item',{
                        'is-active':index === highLightIndex
                    })
                    return(
                    <li key={index} onClick={()=>handleSelect(item)} className={cnames}>{renderTemplate(item)}</li>
                    ) 
                })}
            </ul>

            </Transition>
           
        )
    }
    const highlight = (index:number)=>{
        if(index < 0) index = 0
        if(index > suggestions.length  || index === suggestions.length) {
            index = suggestions.length-1
        }
        setHighLightIndex(index)
    }
    const handleKeyDown = (e:KeyboardEvent<HTMLInputElement>)=>{
       switch(e.keyCode){
           case 13:
               //回车键
               if(suggestions[highLightIndex]){
                    handleSelect(suggestions[highLightIndex])
               }
               break;
            case 38:
                //向上的箭头
                highlight(highLightIndex-1)
                break;
            case 40:
                //向下的箭头
                highlight(highLightIndex+1)
                break;
            case 27:
                //esc箭头
                setShowDropdown(false)
                break;
            default:
                break;
       }
    }
    
    return (
        <div className="lai-auto-complete" ref={componentRef}>
             <Input 
              value={inputValue}
              onChange={handleChange}
              onKeyDown = {handleKeyDown}
              {...restProps}

             />
    
             {generateDropdown()}
        </div>
      
    )
}
export default AutoComplete;