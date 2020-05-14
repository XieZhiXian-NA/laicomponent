import React from 'react';
import {render,RenderResult,fireEvent,cleanup,waitFor,wait} from '@testing-library/react';
import "@testing-library/jest-dom/extend-expect";
import Menu,{MenuProps} from './menu'
import MenuItem from './menuItem'
import SubMenu from './subMenu'

jest.mock('../Icon/icon', () => {
    return () => {
      return <i className="fa" />
    }
  })
  jest.mock('react-transition-group', () => {
    return {
      CSSTransition: (props: any) => {
        return props.children
      }
    }
  })

const testProps:MenuProps = {
    defaultIndex:'0',
    onSelect:jest.fn(),
    className:'test'
}
const testVerProps:MenuProps={
    defaultIndex:'0',
    mode:"vertical",
    className:'test',
    defaultOpenSubMenus:['4']
}
const generateMenu  = (props:MenuProps)=>{
    return (
        <Menu {...props}>
        <MenuItem >
         active
        </MenuItem>
        <MenuItem  disabled>
        disabled
        </MenuItem>
        <MenuItem >
        xlx
        </MenuItem>
       <SubMenu title="dropdown">
           <MenuItem>
              drop1
           </MenuItem>
       </SubMenu>
       <SubMenu title="opened">
           <MenuItem>
              opened1
           </MenuItem>
       </SubMenu>
    </Menu>
    )
}

const createStyleFile = ()=>{
    const cssFile:string=`
       .lai-submenu{
           display:none;
       }
       .lai-submenu.menu-opened{
           display:block
       }
    `
    //创建css样式文件
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = cssFile;
    return style
}

let wrapper:RenderResult,wrapper2:RenderResult,menuElement:HTMLElement,activeElement:HTMLElement,disabledElement:HTMLElement;
describe('test Menu and MenuItem component in default(horizontal) mode',()=>{
    //每个case执行时，都会执行一遍该函数
     beforeEach(()=>{
          wrapper = render(generateMenu(testProps));
          wrapper.container.append(createStyleFile());
          menuElement = wrapper.getByTestId('test-menu');
          activeElement = wrapper.getByText('active');
          disabledElement = wrapper.getByText('disabled');
     })
    it('should render correct Menu and MenuItem based on default props',()=>{
          expect(menuElement).toBeInTheDocument();
          expect(menuElement).toHaveClass('lai-menu test');
        //   expect(menuElement.getElementsByTagName('li').length).toEqual(3);
        // ：scope将是menuElement本身 查找本身下面的第一级的li标签
          expect(menuElement.querySelectorAll(':scope > li').length).toEqual(5);
          expect(activeElement).toHaveClass('menu-item is-active')
          expect(disabledElement).toHaveClass('menu-item is-disabled')
    })
    it('click items should change active and call the right callback',()=>{
          const thirdItem = wrapper.getByText('xlx');
          fireEvent.click(thirdItem);
          expect(thirdItem).toHaveClass('is-active');
          expect(activeElement).not.toHaveClass('is-active');
          expect(testProps.onSelect).toHaveBeenCalled();
          fireEvent.click(disabledElement);
          expect(disabledElement).not.toHaveClass('is-active');
          expect(testProps.onSelect).not.toHaveBeenCalledWith('1')
    })
    
    test('should render vertical mode when mode is set to vertical',()=>{
        //  cleanup();
        //  wrapper = render(generateMenu(testVerProps))
        //  menuElement = wrapper.getByTestId('test-menu')
        //  expect(menuElement).toHaveClass('vertical-menu')
        
    })
    test('should show dropdown items when hover on submenu',async ()=>{
        //没有添加样式，所以是会一直可见的，需要添加样式文件 将其追加元素所在的container上
        expect(wrapper.queryByText('drop1')).not.toBeVisible()
        const dropdownElement = wrapper.getByText('dropdown')
        fireEvent.mouseEnter(dropdownElement)
        // await waitFor(()=>{
        //     expect(wrapper.queryByText('drop1')).toBeVisible();
        // })   
        fireEvent.click(wrapper.getByText('drop1'));
        expect(testProps.onSelect).toHaveBeenCalledWith('3-0');
        fireEvent.mouseLeave(dropdownElement);
        // await waitFor(()=>{
        //     expect(wrapper.queryByText('drop1')).not.toBeVisible()
        // })     
    })
})

describe('test Menu and MenuItem component in vertical mode',()=>{
    beforeEach(()=>{
        wrapper2 = render(generateMenu(testVerProps));
        wrapper2.container.append(createStyleFile());
    })
    it('should render vertical mode when mode is set to vertical',()=>{
        const menuElement = wrapper2.getByTestId('test-menu');
        expect(menuElement).toHaveClass('menu-vertical');
    });
    it('should show dropdown items when click on subMenu for vertical mode',()=>{
        const dropDownItem = wrapper2.queryByText('drop1');
        expect(dropDownItem).not.toBeVisible();
        fireEvent.click(wrapper2.getByText('dropdown'));
        expect(dropDownItem).toBeVisible();
    });
    it('should show subMenu dropdown when defaultOpenSubMenus contain submenu index',()=>{
        expect(wrapper2.queryByText('opened1')).toBeVisible();
    })
})