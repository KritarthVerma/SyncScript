import React from 'react'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { margin } from '@mui/system';

const SettingsBar = ({language,handleLanguageChange,fontSize,handleFontSizeChange,theme,handleThemeChange}) => {
    const styles = {
        color : `${theme==="dark"?"white":"black"}`,
        margin : "10px",
        '.MuiOutlinedInput-notchedOutline': {
            borderColor: `${theme==="dark"?"white":"black"}`,
        },
        '.MuiSelect-icon': {
            color: `${theme==="dark"?"white":"black"}`,
        },
        fontSize:"13px",
        margin:"8px",
    }
  return (
    <div className='settings-bar'>
      <div className='languageSelect'>
        <InputLabel 
            id="languageLabel"
            sx={styles}
        >
                Language
        </InputLabel>
        <Select
            labelId="languageLabel"
            id="language"
            value={language}
            onChange={handleLanguageChange}
            sx={{
                ...styles,
                height:"35px",
                width:"90px",
            }}
        >
            <MenuItem value="c">C</MenuItem>
            <MenuItem value="cpp">C++</MenuItem>
            <MenuItem value="python">Python</MenuItem>
            <MenuItem value="java">Java</MenuItem>
        </Select>
      </div>
      <div className='fontSizeSelect'>
        <label className='fontSizeLabel'>Font Size</label>
            <input 
                value={fontSize}
                onChange={handleFontSizeChange}
                type="range"
                min="12" 
                max="30" 
                step="2"
            />
      </div>
      <div className='themeSelect'>
        <InputLabel 
            id="themeLabel"
            sx={styles}
        >
                Theme
        </InputLabel>
        <Select
            labelId="themeLabel"
            id="theme"
            value={theme}
            onChange={handleThemeChange}
            sx={{
                ...styles,
                height:"35px",
                width:"90px",
            }}
        >
            <MenuItem value="dark">Dark</MenuItem>
            <MenuItem value="light">Light</MenuItem>
        </Select>
      </div>
    </div>
  )
}

export default SettingsBar