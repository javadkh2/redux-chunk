// a redux enhancer to add reducers dynamically
export const addReducerEnhancer = (createStore) => (
  reducer,
  preloadedState
) => {
  // the current reducer  reference
  let currentReducer = reducer;

  // create the normal store
  const { replaceReducer: originalReplaceReducer, ...store } = createStore(
    reducer,
    preloadedState
  );

  function replaceReducer(newReducer) {
    currentReducer = newReducer;
    originalReplaceReducer(newReducer);
  }

  // a addReducer function for the store
  function addReducer(addedReducer: (state, payload) => {}, initial) {
    const oldReducer = currentReducer;
    
    function genericReducer(state, payload) {
      return {
        ...oldReducer(state, payload),
        ...(!addedReducer ? {} : addedReducer((state = initial), payload)),
      };
    }

    replaceReducer(genericReducer);

    return function disableReducer() {
      if (addedReducer) {
        // by assigning undefined to the variable, garbage collector can release the memory  
        addedReducer = undefined;
        // this causes dispatching the REPLACE event
        replaceReducer(currentReducer);
      }
    };
  }

  return {
    ...store,
    replaceReducer,
    addReducer,
  };
};
