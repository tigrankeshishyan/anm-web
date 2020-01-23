import React, { useCallback } from 'react';
import clsx from 'clsx';
import { languages, langStorageKey } from 'locales';
import { isWindowExists } from 'helpers';

import { getCurrentLang } from 'locales/helpers';

import './styles.sass';

function LanguageSwitcher() {
  const currentLang = getCurrentLang();

  const handleLanguageChange = useCallback(lang => {
    if (lang && currentLang !== lang && isWindowExists()) {
      localStorage.setItem(langStorageKey, lang);
      window.location.href = window.location.href.replace(currentLang, lang);
    }
  }, [currentLang]);

  return (
    <ul className="horizontal-nav-menu anm-language-menu">
      {
        Object
          .keys(languages)
          .map(key => {
            const { path, localCode } = languages[key];
            return (
              <li
                key={path}
                className={clsx(
                  'horizontal-nav-menu-item',
                  'anm-navigation-item',
                  { active: currentLang === path },
                )}
                onClick={() => handleLanguageChange(path)}
              >
                {localCode}
              </li>
            );
          })
      }
    </ul>
  );
}

LanguageSwitcher.defaultProps = {};

LanguageSwitcher.propTypes = {};

export default LanguageSwitcher;
