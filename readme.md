# redux-chunk 
`the lib is under development`

## Goals:

- Adding and removing reducers and redux enhancers dynamically to the redux store
- Reducers and enhancers should be normal redux stuff
- keep the API like redux as much as possible

## Usage
```javascript
import { createReduxModule , Provider } from 'redux-chunk';

const module = createReduxModule(reducers, initial, enhancer);

<Provider module={module} feature="FEATURE_NAME">
   <FeatureRootComponent />
</Provider>

