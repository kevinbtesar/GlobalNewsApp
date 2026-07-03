import React, { useState, useRef } from "react";
import {
  Platform,
  ActionSheetIOS,
  UIManager,
  findNodeHandle,
  View,
  TouchableOpacity,
  Image,
  Text
} from "react-native";

const OverflowMenu = (props) => {
  const inputRef = useRef();
  const [open, setOpen] = useState(false);

  const handleClick = (index) => {
    if (index === props.options.length) {
      setOpen(false);
      return;
    }

    const action = props.actions[index];
    if (action) {
      action();
    }
    setOpen(false);
  }

  const handlePressWeb = () => {
    setOpen(true);
  };

  const handlePress = () => {
    // console.log("HERE0")
    let options = props.options;
    if (Platform.OS === "ios") {
      let destructiveIndex = -1;
      if (
        Number.isInteger(props.destructiveIndex) &&
        props.destructiveIndex >= 0
      ) {
        destructiveIndex = props.destructiveIndex;
      }
      const actionSheetOptions = [...options, 'Cancel'];
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: actionSheetOptions,
          destructiveButtonIndex: destructiveIndex,
          cancelButtonIndex: actionSheetOptions.length - 1
        },
        buttonIndex => {
          handleClick(buttonIndex);
        }
      );
    } else if (Platform.OS === "android") {

      UIManager.showPopupMenu(
        findNodeHandle(inputRef.current),
        options,
        () => console.log("something went wrong with the popup menu"),
        (e, i) => {
          handleClick(i);
        }
      );
    }
  };


  let options = open ? (
    <View
      style={{
        position: "absolute",
        bottom: "100%",
        right: "30%",
        flex: 1,
        width: 30,
        elevation: 3,
        shadowColor: "black",
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        borderRadius: 5,
        backgroundColor: "white"
      }}
    >
      {props.options.map((option, index) => {
        return (
          <View key={option}>
            <TouchableOpacity
              style={{ padding: 10 }}
              onPress={(props) => handleClick(index, props)}
            >
              <Text style={{ textAlign: "center" }}>{option}</Text>
            </TouchableOpacity>

            {index < props.options.length - 1 && (
              <View
                style={{
                  flex: 1,
                  height: 1,
                  backgroundColor: "lightgray"
                }}
              />
            )}
          </View>
        );
      })}
    </View>) : null;

  let component = props.button ? (
    <Image source={props.button} style={props.buttonStyle} />
  ) : (
    props.customButton
  );
  if (Platform.OS === "web") {
    return (
      <View>
        <View>
          <TouchableOpacity ref={inputRef} onPress={handlePressWeb}>
            {component}
          </TouchableOpacity>
        </View>
        {options}
      </View>
    );
  } else {
    return (
      <View>
        <TouchableOpacity ref={inputRef} onPress={handlePress}>
          {component}
        </TouchableOpacity>
      </View>
    );
  }

}

export default OverflowMenu;
