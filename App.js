import React, { useState } from "react";
// import devToolsEnhancer from "remote-redux-devtools";
import * as Font from "expo-font";
import { AppLoading } from "expo";
import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";
import { enableScreens } from "react-native-screens";
import {
  composeWithDevTools,
  devToolsEnhancer
} from "redux-devtools-extension";

import productReducer from "./store/reducers/products";
import cartRedcer from "./store/reducers/cart";
import ShopNavigator from "./navigation/ShopNavigator";

enableScreens();

const rootReducer = combineReducers({
  products: productReducer,
  cart: cartRedcer
});

const store = createStore(rootReducer, devToolsEnhancer());

const fetchFonts = () => {
  return Font.loadAsync({
    "open-sans": require("./assets/OpenSans-Regular.ttf"),
    "open-sans-bold": require("./assets/OpenSans-Bold.ttf")
  });
};

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);
  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setFontLoaded(true)}
      ></AppLoading>
    );
  }
  return (
    <Provider store={store}>
      <ShopNavigator></ShopNavigator>
    </Provider>
  );
}
