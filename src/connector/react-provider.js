import { useEffect, useState } from "react";
import {
  Provider as ReduxProvider,
  ReactReduxContext,
  useStore
} from "react-redux";


export function useModuleStore(module, feature) {
  const store = useStore();
  const [myStore, setMyStore] = useState(null);

  useEffect(() => {
    const moduleStore = module(feature, store);
    setMyStore(moduleStore);
    return moduleStore.detachModule;
  }, [feature, module, store]);

  return myStore;
}

export function Provider({ module, feature, children, context }) {
  
  const myStore = useModuleStore(module, feature);

  const Context = context || ReactReduxContext;

  return (
    myStore && (
      <ReduxProvider store={myStore} context={Context}>
        {children}
      </ReduxProvider>
    )
  );
}
