import React from "react";
import { FlatList, Button, Alert, View, Text } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import HeaderBotton from "../../components/UI/HeaderButton";
import ProductItem from "../../components/shop/ProductItem";
import Colors from "../../constants/Colors";
import * as productActions from "../../store/actions/products";

const UserProductsScreen = props => {
  const userProducts = useSelector(state => state.products.userProducts);
  const dispatch = useDispatch();

  const editProductHandler = id => {
    props.navigation.navigate("EditProduct", { productId: id });
  };

  const deleteHandler = id => {
    Alert.alert("Are you sure?", "Want to delete?", [
      { text: "No", style: "default" },
      {
        text: "Yes",
        style: "destructive",
        onPress: () => {
          dispatch(productActions.deleteProduct(id));
        }
      }
    ]);
  };

  if (userProducts.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No products found</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={userProducts}
      keyExtractor={item => item.id}
      renderItem={itemData => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() => {
            editProductHandler(itemData.item.id);
          }}
        >
          <Button
            color={Colors.primary}
            title="Edit"
            onPress={() => {
              editProductHandler(itemData.item.id);
            }}
          ></Button>
          <Button
            color={Colors.accent}
            title="Delete"
            onPress={() => {
              deleteHandler(itemData.item.id);
            }}
          ></Button>
        </ProductItem>
      )}
    ></FlatList>
  );
};

UserProductsScreen.navigationOptions = navData => {
  return {
    headerTitle: "Your Products",
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
          title="Add"
          iconName="md-create"
          onPress={() => {
            navData.navigation.navigate("EditProduct");
          }}
        ></Item>
      </HeaderButtons>
    )
  };
};

export default UserProductsScreen;
