import { useEffect } from 'react';

export const useSuppressHydrationWarning = () => {
  useEffect(() => {
    // This effect runs only on the client side after hydration
    const removeFdProcessedId = () => {
      // Remove fdprocessedid attributes from all elements
      document.querySelectorAll('[fdprocessedid]').forEach(el => {
        el.removeAttribute('fdprocessedid');
      });
    };

    // Run once after initial render
    removeFdProcessedId();

    // Set up a mutation observer to handle dynamically added elements
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' || mutation.type === 'attributes') {
          removeFdProcessedId();
        }
      });
    });

    // Start observing the document with the configured parameters
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['fdprocessedid']
    });

    // Clean up the observer when the component unmounts
    return () => observer.disconnect();
  }, []);
};

export default useSuppressHydrationWarning;
