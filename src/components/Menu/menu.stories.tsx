import React from 'react';
import {storiesOf} from '@storybook/react';
import Menu from './menu'
import MenuItem from './menuItem'
import SubMenu from './subMenu'

export const defaultMenu = ()=>(
    <Menu   onSelect={(index)=>alert(index)}  defaultOpenSubMenus={['2']}>
    <MenuItem >
       cool link 
    </MenuItem>
    <MenuItem  disabled>
       cool link2 
    </MenuItem>

      <SubMenu title="cool link3">
           <MenuItem >
             childOne 
         </MenuItem>
         <MenuItem >
             childTwo 
         </MenuItem>
      </SubMenu>
       
    
  </Menu>
)

storiesOf('Menu Component',module)
.add('Menu',defaultMenu)