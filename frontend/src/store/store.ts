// store/store.ts
import { configureStore, ThunkAction } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import { Action, combineReducers } from 'redux';
import { apiSlice } from "./api/apiSlice"
import { setupListeners } from '@reduxjs/toolkit/query';
import projectsReducer from "./slices/dashboard/projectsSlice"
import professionsReducer from "./slices/dashboard/professionsSlice"
import productsnReducer from "./slices/product/productSlice"
import informationReducer from "./slices/information/contentSlice"
import productFormReducer from "./slices/product/productFormSlice"
import classificationFormReducer from "./slices/product/variantClassificationSlice"
import promotionFormReducer from "./slices/promotion/promotionForm"
import promotionFormGiftReducer from "./slices/promotion/promotionFormGift"
import promotionFormBulkReducer from "./slices/promotion/promotionFormBulk"
import promotionReducer from "./slices/promotion/promotion"
import promotionCreateReducer from "./slices/promotion/createPromotion"
import settingReducer from "./slices/settingSlice"
import breadcrumbReducer from "./slices/breadcrumb"
import chatReducer from "./slices/chatSlice"
import memoryReducer from "./slices/memorySlice"
import ordersReducer from "./slices/orderSlice"
import planReducer from "./slices/plan"

// Combine reducers (for scalability)
const rootReducer = combineReducers({
  projects: projectsReducer,
  professions: professionsReducer,
  information: informationReducer,
  products: productsnReducer,
  productForm: productFormReducer,
  classification: classificationFormReducer,
  promotionForm:promotionFormReducer,
  promotionFormGift:promotionFormGiftReducer,
  promotionFormBulk:promotionFormBulkReducer,
  promotion:promotionReducer,
  promotionCreate:promotionCreateReducer,
  setting:settingReducer,
  breadcrumb:breadcrumbReducer,
  chat:chatReducer,
  memory:memoryReducer,
  plan:planReducer,

  orders:ordersReducer,


});

// Persist config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'], // only persist the user slice
};

// Wrap root reducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store with persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    })
});

// Create persistor
export const persistor = persistStore(store);

setupListeners(store.dispatch)


// Type definitions
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
