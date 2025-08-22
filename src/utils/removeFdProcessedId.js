// This script removes fdprocessedid attributes that cause hydration mismatches
export function removeFdProcessedId() {
  if (typeof window === 'undefined') return () => {};
  
  // Function to remove all fdprocessedid attributes
  const removeAllFdProcessedIds = () => {
    const elements = document.querySelectorAll('[fdprocessedid]');
    for (const el of elements) {
      try {
        el.removeAttribute('fdprocessedid');
      } catch (e) {
        console.warn('Failed to remove fdprocessedid:', e);
      }
    }
  };
  
  // Run immediately
  removeAllFdProcessedIds();
  
  // Also run after a short delay to catch any dynamically added attributes
  const timeoutId = setTimeout(removeAllFdProcessedIds, 100);
  
  // Set up a mutation observer to remove from dynamically added elements
  const observer = new MutationObserver((mutations) => {
    let needsCleanup = false;
    
    for (const mutation of mutations) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'fdprocessedid') {
        try {
          mutation.target.removeAttribute('fdprocessedid');
        } catch (e) {
          console.warn('Failed to remove fdprocessedid:', e);
        }
        needsCleanup = true;
      }
      
      if (mutation.addedNodes) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === 1) { // ELEMENT_NODE
            if (node.hasAttribute('fdprocessedid')) {
              try {
                node.removeAttribute('fdprocessedid');
              } catch (e) {
                console.warn('Failed to remove fdprocessedid:', e);
              }
              needsCleanup = true;
            }
            
            try {
              const elements = node.querySelectorAll?.('[fdprocessedid]') || [];
              for (const el of elements) {
                el.removeAttribute('fdprocessedid');
              }
              if (elements.length > 0) needsCleanup = true;
            } catch (e) {
              console.warn('Error querying for fdprocessedid:', e);
            }
          }
        }
      }
    }
    
    // If we found any fdprocessedid attributes, do another pass
    if (needsCleanup) {
      removeAllFdProcessedIds();
    }
  });
  
  // Start observing with a wider scope
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['fdprocessedid']
  });
  
  // Cleanup function
  return () => {
    clearTimeout(timeoutId);
    observer.disconnect();
  };
}
