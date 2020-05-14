var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React, { useState, useEffect, useRef } from 'react';
import Input from '../Input/input';
import Icon from '../Icon/icon';
import useDebounce from '../../hooks/useDebounce';
import useClickOutside from '../../hooks/useClickOutside';
import classNames from 'classnames';
import Transition from '../Transition/transition';
/**
 *
 * input输入框的动态查询下拉框功能，支持同步和异步
 */
export var AutoComplete = function (props) {
    var fetchSuggestion = props.fetchSuggestion, onSelect = props.onSelect, value = props.value, renderOption = props.renderOption, restProps = __rest(props, ["fetchSuggestion", "onSelect", "value", "renderOption"]);
    var _a = useState(value), inputValue = _a[0], setInputValue = _a[1];
    var _b = useState([]), suggestions = _b[0], setSuggestions = _b[1];
    var _c = useState(false), loading = _c[0], setLoading = _c[1];
    var _d = useState(false), showDropdown = _d[0], setShowDropdown = _d[1];
    var debounceValue = useDebounce(inputValue, 500);
    var _e = useState(-1), highLightIndex = _e[0], setHighLightIndex = _e[1];
    var triggerSearch = useRef(false);
    var componentRef = useRef(null);
    useClickOutside(componentRef, function () {
        setSuggestions([]);
    });
    useEffect(function () {
        if (debounceValue && triggerSearch.current) {
            setSuggestions([]);
            var results = fetchSuggestion(debounceValue);
            if (results instanceof Promise) {
                setLoading(true);
                results.then(function (data) {
                    setLoading(false);
                    setSuggestions(data);
                    if (data.length > 0) {
                        setShowDropdown(true);
                    }
                });
            }
            else {
                setSuggestions(results);
                if (results.length > 0) {
                    setShowDropdown(true);
                }
            }
        }
        else {
            setShowDropdown(false);
        }
        setHighLightIndex(-1);
    }, [debounceValue, fetchSuggestion]);
    var handleChange = function (e) {
        var value = e.target.value.trim();
        setInputValue(value);
        triggerSearch.current = true;
    };
    var handleSelect = function (item) {
        setInputValue(item.value);
        setShowDropdown(false);
        if (onSelect) {
            onSelect(item);
        }
        triggerSearch.current = false;
    };
    var renderTemplate = function (item) {
        return renderOption ? renderOption(item) : item.value;
    };
    var generateDropdown = function () {
        return (React.createElement(Transition, { in: showDropdown || loading, animation: "zoom-in-left", timeout: 300, onExited: function () { return setSuggestions([]); } },
            React.createElement("ul", { className: "lai-suggestion-list" },
                loading && React.createElement("div", { className: "suggestions-loading-icon" },
                    React.createElement(Icon, { icon: "spinner", spin: true })),
                suggestions.map(function (item, index) {
                    var cnames = classNames('suggestion-item', {
                        'is-active': index === highLightIndex
                    });
                    return (React.createElement("li", { key: index, onClick: function () { return handleSelect(item); }, className: cnames }, renderTemplate(item)));
                }))));
    };
    var highlight = function (index) {
        if (index < 0)
            index = 0;
        if (index > suggestions.length || index === suggestions.length) {
            index = suggestions.length - 1;
        }
        setHighLightIndex(index);
    };
    var handleKeyDown = function (e) {
        switch (e.keyCode) {
            case 13:
                //回车键
                if (suggestions[highLightIndex]) {
                    handleSelect(suggestions[highLightIndex]);
                }
                break;
            case 38:
                //向上的箭头
                highlight(highLightIndex - 1);
                break;
            case 40:
                //向下的箭头
                highlight(highLightIndex + 1);
                break;
            case 27:
                //esc箭头
                setShowDropdown(false);
                break;
            default:
                break;
        }
    };
    return (React.createElement("div", { className: "lai-auto-complete", ref: componentRef },
        React.createElement(Input, __assign({ value: inputValue, onChange: handleChange, onKeyDown: handleKeyDown }, restProps)),
        generateDropdown()));
};
export default AutoComplete;
