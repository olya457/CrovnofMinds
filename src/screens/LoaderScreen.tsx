import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  StatusBar,
  Platform,
  Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Loader'>;

const WEB_MS = 3000;
const LOGO_MS = 2000;

const { width: W, height: H } = Dimensions.get('window');
const IS_SMALL = Math.min(W, H) < 700 || W <= 360;
const RING_SIZE = Math.round(Math.min(W, H) * (IS_SMALL ? 0.28 : 0.34));
const LOGO_W = Math.round(Math.min(W, H) * (IS_SMALL ? 0.48 : 0.6));
const LOGO_H = LOGO_W;

const html = `
<!doctype html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
<style>
  html,body{margin:0;padding:0;background:transparent;overflow:hidden}
  .c{position:fixed;inset:0;display:flex;align-items:center;justify-content:center}
  .wrap{position:relative;width:100%;height:100%;display:flex;align-items:center;justify-content:center}
  .dot{
    position:absolute;width:22vmin;height:22vmin;max-width:28px;max-height:28px;min-width:14px;min-height:14px;
    border-radius:50%;background:#e9c775;filter:drop-shadow(0 0 10px rgba(233,199,117,.6));
    animation:pulse 1.6s ease-in-out infinite;
  }
  .r{position:absolute;border-radius:50%;border:2px solid rgba(233,199,117,.35);box-shadow:0 0 16px rgba(233,199,117,.25) inset;}
  .r1{animation:wave 1.8s linear infinite}
  .r2{animation:wave 1.8s linear infinite .25s}
  .r3{animation:wave 1.8s linear infinite .5s}
  @keyframes wave{
    0%{transform:scale(.35);opacity:.9}
    70%{opacity:.25}
    100%{transform:scale(1);opacity:0}
  }
  @keyframes pulse{
    0%,100%{transform:scale(.9);opacity:.95}
    50%{transform:scale(1.15);opacity:1}
  }
</style>
</head>
<body>
  <div class="c">
    <div class="wrap">
      <div class="r r1" style="width:64vmin;height:64vmin;max-width:160px;max-height:160px;"></div>
      <div class="r r2" style="width:78vmin;height:78vmin;max-width:195px;max-height:195px;"></div>
      <div class="r r3" style="width:92vmin;height:92vmin;max-width:230px;max-height:230px;"></div>
      <div class="dot"></div>
    </div>
  </div>
</body>
</html>
`;

const LoaderScreen: React.FC<Props> = ({ navigation }) => {
  const [stage, setStage] = useState<'web' | 'logo'>('web');
  const timers = useRef<number[]>([]);

  useEffect(() => {
    timers.current.push(setTimeout(() => setStage('logo'), WEB_MS) as unknown as number);
    timers.current.push(setTimeout(() => navigation.replace('Onboarding'), WEB_MS + LOGO_MS) as unknown as number);
    return () => { timers.current.forEach(t => clearTimeout(t)); };
  }, [navigation]);

  return (
    <ImageBackground
      source={require('../assets/background.png')}
      resizeMode="cover"
      style={styles.bg}
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.center}>
        {stage === 'web' ? (
          <View style={styles.loaderBox}>
            <WebView
              originWhitelist={['*']}
              style={[styles.webview, { width: RING_SIZE, height: RING_SIZE }]}
              scrollEnabled={false}
              bounces={false}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              automaticallyAdjustContentInsets={false}
              androidHardwareAccelerationDisabled={false}
              containerStyle={{ backgroundColor: 'transparent' }}
              setSupportMultipleWindows={false}
              javaScriptEnabled
              domStorageEnabled
              source={{ html }}
            />
            <Text style={[styles.loadingText, IS_SMALL && { fontSize: 12, marginTop: 10 }]}>loading</Text>
          </View>
        ) : (
          <View style={styles.logoBox}>
            <Image
              source={require('../assets/logo.png')}
              style={[styles.logo, { width: LOGO_W, height: LOGO_H }]}
            />
          </View>
        )}
      </View>
    </ImageBackground>
  );
};

export default LoaderScreen;

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#0a0a0a' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loaderBox: { alignItems: 'center', justifyContent: 'center' },
  webview: {
    backgroundColor: 'transparent',
    ...(Platform.OS === 'ios' ? { opacity: 0.98 } : {}),
  },
  loadingText: {
    marginTop: 14,
    color: '#e6c980',
    fontSize: 14,
    letterSpacing: 1.1,
    textTransform: 'lowercase',
  },
  logoBox: { alignItems: 'center', justifyContent: 'center' },
  logo: { resizeMode: 'contain' },
});
