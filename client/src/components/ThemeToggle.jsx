import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setTheme } from '../store/theme/index';
import '../assets/css/theme.css'

export const changeTheme = (theme, dispatch) => {
    dispatch(setTheme(theme))
}
const ThemeToggle = () => {
    const theme = useSelector(state => state.theme.dataTheme);
    const dispatch = useDispatch();
    const handleChangeTheme = (e) => {
        const theme = e.target.checked ? 'dark' : 'light'; 
        changeTheme(theme, dispatch);
    }

  return (
    <div>
        <input type="checkbox" name="theme_toggle" id="theme_toggle" hidden
            checked={theme === 'dark'}
            onChange={handleChangeTheme}
        />
        <label htmlFor="theme_toggle" className='theme_toggler'>
            <span className={`${theme === 'dark' ? 'toggle_dark' : 'toggle_light'}`}>

            </span>
        </label>
    </div>
  )
}

export default ThemeToggle