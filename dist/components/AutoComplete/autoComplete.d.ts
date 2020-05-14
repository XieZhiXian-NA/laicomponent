import { FC, ReactElement } from 'react';
import { InputProps } from '../Input/input';
interface DataSourceObject {
    value: string;
}
export declare type DataSourceType<T = {}> = T & DataSourceObject;
export interface AutoCompleteProps extends Omit<InputProps, 'onSelect'> {
    fetchSuggestion: (str: string) => DataSourceType[] | Promise<DataSourceType[]>;
    onSelect?: (str: DataSourceType) => void;
    renderOption?: (item: DataSourceType) => ReactElement;
}
/**
 *
 * input输入框的动态查询下拉框功能，支持同步和异步
 */
export declare const AutoComplete: FC<AutoCompleteProps>;
export default AutoComplete;
