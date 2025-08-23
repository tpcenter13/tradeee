'use client';

import { useEffect } from 'react';

const BotpressChat = () => {
  useEffect(() => {
    // Inject Botpress webchat script
    const injectScript = document.createElement('script');
    injectScript.src = 'https://cdn.botpress.cloud/webchat/v3.2/inject.js';
    injectScript.defer = true;

    injectScript.onload = () => {
      // Inject your Botpress configuration script after webchat loads
      const configScript = document.createElement('script');
      configScript.src = 'https://files.bpcontent.cloud/2025/08/23/02/20250823023629-FN38L458.js';
      configScript.defer = true;
      document.head.appendChild(configScript);
    };

    document.head.appendChild(injectScript);

    return () => {
      // Cleanup scripts when component unmounts
      if (document.head.contains(injectScript)) {
        document.head.removeChild(injectScript);
      }
    };
  }, []);

  return <div id="botpress-webchat" />;
};

export default BotpressChat;
