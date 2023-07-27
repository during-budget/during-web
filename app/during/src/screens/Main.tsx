import React, {useEffect, useRef, useState} from 'react';
import {BackHandler, Dimensions, Platform, StyleSheet} from 'react-native';
import {
  BannerAdSize,
  GAMBannerAd,
  TestIds,
} from 'react-native-google-mobile-ads';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import {WebViewNativeEvent} from 'react-native-webview/lib/RNCWebViewNativeComponent';

const Main = () => {
  const webview = useRef<WebView>(null);
  const [navState, setNaveState] = useState<WebViewNativeEvent>();

  const unitID =
    Platform.select({
      ios: 'ca-app-pub-7896727622535419/3140414754',
      android: 'ca-app-pub-7896727622535419/9945496251',
    }) || '';

  const adUnitId = __DEV__ ? TestIds.BANNER : unitID;

  useEffect(() => {
    const canGoBack = navState?.canGoBack;

    const onPress = () => {
      if (canGoBack) {
        webview?.current?.goBack();
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
          ref={webview}
          source={{uri: 'https://during.money'}}
          style={styles.webview}
          onNavigationStateChange={event => setNaveState(event)}
          onLoadEnd={() => {
            webview.current?.postMessage(
              JSON.stringify({
                platform: Platform.OS,
              }),
            );
          }}
        />
        <GAMBannerAd
          unitId={adUnitId}
          sizes={[BannerAdSize.FULL_BANNER]}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
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
