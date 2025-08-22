// src/components/FontAwesomeProvider.js
import { config, library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';

config.autoAddCss = false; // Huwag automatic mag-load ng CSS
library.add(fas); // Load lahat ng solid icons

export default function FontAwesomeProvider({ children }) {
  return <>{children}</>;
}
