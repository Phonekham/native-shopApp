import React, { useEffect, useState, useCallback } from "react";
import { FlatList, Button, ActivityIndicator, View, Text } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import ProductItem from "../../components/shop/ProductItem";
import * as cartActions from "../../store/actions/cart";
import * as productsActions from "../../store/actions/products";
import HeaderBotton from "../../components/UI/HeaderButton";
import Colors from "../../constants/Colors";

const ProductsOverviewScreen = props => {
  const [isLoading, setIsloading] = useState(false);
  const [isRefreashing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const products = useSelector(state => state.products.availableProducts);
  const dispatch = useDispatch();

  const loadProducts = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(productsActions.fetchProducts());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsloading, setError]);

  useEffect(() => {
    loadProducts().then(() => {
      setIsloading(false);
    });
  }, [dispatch, loadProducts]);
  useEffect(() => {
    const willFocusSub = props.navigation.addListener(
      "willFocus",
      loadProducts
    );
    return () => {
      willFocusSub.remove();
    };
  }, [loadProducts]);

  const selectedItemHandler = (id, title) => {
    props.navigation.navigate("ProductDetail", {
      productId: id,
      productTitle: title
    });
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator
          size="large"
          color={Colors.primary}
        ></ActivityIndicator>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>An error occurred</Text>
        <Button
          title="Try again"
          onPress={loadProducts}
          color={Colors.primary}
        ></Button>
      </View>
    );
  }

  if (!isLoading && products.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No Products found</Text>
      </View>
    );
  }

  return (
    <FlatList
      onRefresh={loadProducts}
      refreshing={isRefreashing}
      data={products}
      keyExtractor={item => item.id}
      renderItem={itemData => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() => {
            selectedItemHandler(itemData.item.id, itemData.item.title);
          }}
        >
          <Button
            color={Colors.primary}
            title="View Details"
            onPress={() => {
              selectedItemHandler(itemData.item.id, itemData.item.title);
            }}
          ></Button>
          <Button
            color={Colors.accent}
            title="Go To Cart"
            onPress={() => {
              dispatch(cartActions.addToCart(itemData.item));
            }}
          ></Button>
        </ProductItem>
      )}
    ></FlatList>
  );
};

ProductsOverviewScreen.navigationOptions = navData => {
  return {
    headerTitle: "All Product",
    headerLeft: (
      <HeaderButtons HeaderButtonComponent={HeaderBotton}>
        <Item
          title="Menu"
          iconName="md-menu"
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        ></Item>
      </HeaderButtons>
    ),
    headerRight: (
      <HeaderButtons HeaderButtonComponent={HeaderBotton}>
        <Item
          title="Cart"
          iconName="md-cart"
          onPress={() => {
            navData.navigation.navigate("Cart");
          }}
        ></Item>
      </HeaderButtons>
    )
  };
};

export default ProductsOverviewScreen;
