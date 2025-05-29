import React from 'react'
import '../assets/css/sidebar.css'
import { sideBarLinks } from '../constants/navlinks'
import { NavLink } from 'react-router-dom'
import logo from '../assets/imgs/logo.jpg' // Assuming you have a logo image

const Sidebar = () => {
  return (
    <aside className='sidebar'>
        <div className='sidebar__header'>
           <img className='sidebar__logo' src={logo} /> <h2 className='sidebar__title'>Dashboard</h2>
        </div>
        <nav className='sidebar__nav'>
            <ul className='sidebar__list'>
                {
                    sideBarLinks.map(link => (
                        <li key={link.name} className='sidebar__item'>
                            <NavLink to={link.link} className='sidebar__link'>
                                <span>
                                    {React.createElement(link.icon, { size: 25 })}
                                </span>
                                <span>{link.name}</span>
                            </NavLink>
                        </li>
                    ))
                }
            </ul>
        </nav>
    </aside>
  )
}

export default Sidebar