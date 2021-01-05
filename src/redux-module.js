export function createModule(
  reducer,
  preloadedState,
  enhancer,
  featureName,
  store
) {
  if (typeof store.addReducer !== "function") {
    throw new Error("addReducerEnhancer should be added to the main store");
  }
  // we need this abstraction for run other enhancers correctly
  function enhanceStore(reducer, preloadedState, enhancer) {
    if (typeof preloadedState === "function") {
      enhancer = preloadedState;
      preloadedState = undefined;
    }

    if (typeof enhancer === "function") {
      return enhancer(enhanceStore)(reducer, preloadedState);
    }

    function addMyReducer(myReducer) {
      function reducerFn(state, action) {
        return { [featureName]: myReducer(state[featureName], action) };
      }
      return store.addReducer(reducerFn, { [featureName]: preloadedState });
    }

    let remover = addMyReducer(reducer);

    // custom replace reducer to replace only the module reducer
    function replaceReducer(newReducer) {
      remover();
      remover = addMyReducer(newReducer);
    }

    return {
      ...store,
      featureName,
      replaceReducer,
      detachModule: () => remover(),
    };
  }
  return enhanceStore(reducer, preloadedState, enhancer);
}

// an abstraction to keep the API like redux create store and make the module
// and make it more flexible by partially pass the params
export const createReduxModule = (reducer, preloadedState, enhancer) => (
  featureName,
  store
) => createModule(reducer, preloadedState, enhancer, featureName, store);
