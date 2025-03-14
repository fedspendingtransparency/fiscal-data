import React, { useEffect, useState } from 'react';
import { switcher, slider, toggleWrapper, round, toggleCheckbox } from './dark-mode-toggle.module.scss';

const DarkModeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // On mount, read from local storage and update the document element
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark-mode');
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    }
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={toggleWrapper}>
      <label className={switcher}>
        {' '}
        <div style={{ right: '40px', position: 'absolute' }}> DarkMode</div>
        <input type="checkbox" checked={isDarkMode} onChange={toggleDarkMode} className={toggleCheckbox} />
        <span className={`${slider} ${round}`} />
      </label>
    </div>
  );
};

export default DarkModeToggle;
