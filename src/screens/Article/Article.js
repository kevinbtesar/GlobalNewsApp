import React from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Dimensions,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import Snackbar from 'react-native-snackbar';

import Colors from '../../utils/Colors';
import GLOBAL from '../../store/globalStore';
import { showSnackbar } from '../../components/Snackbar/SnackbarComponent';

const Article = ({ route, navigation }) => {
  const article = route?.params ?? {};
  const url = article.url ?? '';
  const webViewRef = React.useRef(null);
  const canGoBackRef = React.useRef(false);

  React.useEffect(() => {
    GLOBAL.webviewRef = webViewRef;

    return () => {
      if (GLOBAL.webviewRef === webViewRef) {
        GLOBAL.webviewRef = null;
      }
    };
  }, []);

  React.useEffect(() => {
    if (Platform.OS !== 'android') {
      return undefined;
    }

    const onAndroidBackPress = () => {
      if (webViewRef.current && canGoBackRef.current) {
        webViewRef.current.goBack();
        return true;
      }

      navigation.goBack();
      return true;
    };

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onAndroidBackPress
    );

    return () => subscription.remove();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: url }}
        userAgent="Mozilla/5.0 (Linux; Android 4.4.4; One Build/KTU84L.H4) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/33.0.0.0 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/28.0.0.20.16;]"
        decelerationRate="normal"
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        sharedCookiesEnabled
        mixedContentMode="always"
        startInLoadingState
        textInteractionEnabled={false}
        setSupportMultipleWindows={false}
        automaticallyAdjustContentInsets
        containerStyle={[
          styles.webViewContainer,
          {
            marginTop:
              Platform.OS === 'android'
                ? Dimensions.get('window').width >= 768
                  ? -100
                  : -90
                : 0,
          },
        ]}
        style={styles.webView}
        renderLoading={() => (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        )}
        onContentProcessDidTerminate={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('Content process terminated, reloading', nativeEvent);
          webViewRef.current?.reload();
        }}
        originWhitelist={['http://*', 'https://*']}
        onNavigationStateChange={(navState) => {
          GLOBAL.webviewRef = webViewRef;
          canGoBackRef.current = navState.canGoBack;
        }}
        onShouldStartLoadWithRequest={(request) => {
          if (!url) {
            return false;
          }

          if (request.url.startsWith(url) || request.url.includes('redirect')) {
            return true;
          }

          showSnackbar('Cannot change from source URL', Snackbar.LENGTH_LONG);

          if (
            request.lockIdentifier &&
            !request.canGoBack &&
            !request.canGoForward &&
            request.loading
          ) {
            navigation.goBack();
          }

          return false;
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  webViewContainer: {
    flex: 1,
  },
  webView: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
});

export default Article;
