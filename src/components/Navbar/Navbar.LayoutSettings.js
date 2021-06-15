import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import cx from 'classnames'
import _entries from 'lodash/entries'
import _map from 'lodash/map'

import OutsideClickHandler from 'react-outside-click-handler'
import { storeUnsavedLayout } from '../../redux/actions/ui'
import { getLayouts, getActiveMarket, getCurrentUnsavedLayout } from '../../redux/selectors/ui'
import { getLocation } from '../../redux/selectors/router'
import { useLayout } from '../GridLayout/GridLayout.helpers'

import { ReactComponent as LayoutIcon } from './layout-icon.svg'
import NavbarButton from './Navbar.Button'
import * as Routes from '../../constants/routes'

import AddLayoutComponentModal from '../AddLayoutComponentModal'
import CreateNewLayoutModal from '../CreateNewLayoutModal'

function Item({
  children, isLayout, isSelected, ...props
}) {
  return (
    <div
      className={cx('hfui-navbar__layout-settings__item', {
        'is-layout': isLayout,
        'is-selected': isSelected,
      })}
      {...props}
    >
      {children}
    </div>
  )
}

export default function LayoutSettings() {
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false)
  const [isCreateNewLayoutModalOpen, setIsCreateNewLayoutModalOpen] = useState(false)
  const [isAddLayoutComponentModalOpen, setIsAddLayoutComponentModalOpen] = useState(false)
  const { layoutID, unsaved } = useLayout()
  const layouts = useSelector(getLayouts)
  const { pathname } = useSelector(getLocation)

  if (![
    Routes.tradingTerminal.path,
    Routes.marketData.path,
  ].includes(pathname)) {
    return null
  }

  const selectableLayouts = _entries(layouts).reduce((nextLayouts, [id, layout]) => {
    if (layout.routePath === pathname) {
      nextLayouts.push({
        id,
        ...layout,
      })
    }

    return nextLayouts
  }, [])

  return (
    <div className='hfui-navbar__layout-settings'>
      <NavbarButton
        icon={LayoutIcon}
        onClick={() => setIsOpen(true)}
        className={isOpen ? 'is-open' : undefined}
      />
      {isOpen && (
        <OutsideClickHandler onOutsideClick={() => setIsOpen(false)}>
          <div className='hfui-navbar__layout-settings__menu'>
            <div className='hfui-navbar__layout-settings__title'>
              Layout settings
            </div>
            <div className='hfui-navbar__layout-settings__menu-buttons' onClick={() => setIsOpen(false)}>
              <Item onClick={() => setIsAddLayoutComponentModalOpen(true)}>
                Add Component
              </Item>
              <Item>
                Save
                {' '}
                {unsaved && <span className='hfui-navbar__layout-settings__item-unsaved'>- You have changes</span>}
              </Item>
              <Item onClick={() => setIsCreateNewLayoutModalOpen(true)}>
                Create New Layout
              </Item>
              <div className='hfui-navbar__layout-settings__separator' />
              {_map(selectableLayouts, layout => (
                <Item
                  key={layout.id}
                  isLayout
                  isSelected={layout.id === layoutID}
                  onClick={() => dispatch(storeUnsavedLayout(layout))}
                >
                  {layout.id}
                  {layout.canDelete && (
                    <div className='hfui-navbar__layout-settings__delete'>
                      <i className='icon-clear' onClick={() => {}} />
                    </div>
                  )}
                </Item>
              ))}
            </div>
          </div>
        </OutsideClickHandler>
      )}
      <CreateNewLayoutModal
        isOpen={isCreateNewLayoutModalOpen}
        onClose={() => setIsCreateNewLayoutModalOpen(false)}
      />
      <AddLayoutComponentModal
        isOpen={isAddLayoutComponentModalOpen}
        onClose={() => setIsAddLayoutComponentModalOpen(false)}
      />
    </div>
  )
}
