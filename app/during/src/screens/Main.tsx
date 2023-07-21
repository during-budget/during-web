import React, {useEffect, useRef, useState} from 'react';
import {BackHandler, Dimensions, StyleSheet} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import {WebViewNativeEvent} from 'react-native-webview/lib/RNCWebViewNativeComponent';

const Main = () => {
  const ref = useRef<WebView>(null);
  const [navState, setNaveState] = useState<WebViewNativeEvent>();

  useEffect(() => {
    const canGoBack = navState?.canGoBack;

    const onPress = () => {
      if (canGoBack) {
        ref?.current?.goBack();
        return true;
      } else {
        return false;
      }
    };

    BackHandler.addEventListener('hardwareBackPress', onPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onPress);
    };
  }, [navState?.canGoBack]);

  return (
    <SafeAreaProvider>
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
        <WebView
          ref={ref}
          source={{uri: 'https://during.money'}}
          style={styles.webview}
          onNavigationStateChange={event => setNaveState(event)}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
    width: deviceWidth,
    height: deviceHeight,
  },
});

export default Main;
