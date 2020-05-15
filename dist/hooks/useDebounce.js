import { useState, useEffect } from 'react';
function useDebounce(value, delay) {
    if (delay === void 0) { delay = 300; }
    var _a = useState(value), debounceValue = _a[0], setDebounceValue = _a[1];
    useEffect(function () {
        var handler = window.setTimeout(function () {
            setDebounceValue(value);
        }, delay);
        return function () {
            clearTimeout(handler);
        };
        //不用计算时间的延迟，当value改变时，直接就清除上一次的timeOut
        //当用户的输入停止为300s后，才触发set函数
    }, [value, delay]);
    return debounceValue;
}
export default useDebounce;
