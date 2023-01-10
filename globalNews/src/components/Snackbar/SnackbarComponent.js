// import { Platform, ToastAndroid, ActionSheetIOS } from 'react-native';
// import * as React from 'react';
// import { View, StyleSheet, Dimensions } from 'react-native';
import Snackbar from 'react-native-snackbar';


export function showSnackbar(message, length) {

  if(length == 0){
    length = Snackbar.LENGTH_INDEFINITE
  } else if(length == 1){
    length = Snackbar.LENGTH_SHORT
  } else if(length == 2){
    length = Snackbar.LENGTH_LONG
  }


  Snackbar.show({
    text: message,
    duration: length,
    action: {
      text: 'OK',
      textColor: 'blue',
      onPress: hideSnackbar(),
    },
  })
}

export function hideSnackbar() {
  Snackbar.dismiss()
}



// function responseMessage(message) {

//     // console.log("Platform.OS: " + Platform.OS)
//     if(Platform.OS == 'android') 
//     {
//         // console.log("message: " + message)
//         ToastAndroid.show(message, ToastAndroid.LONG);

//     } else {
//         ActionSheetIOS.showActionSheetWithOptions(
//             {
//               options: ["Cancel", message, "Reset"],
//               destructiveButtonIndex: 2,
//               cancelButtonIndex: 0,
//               userInterfaceStyle: 'dark',
//             })

//     }
// }

// export responseMessage;


