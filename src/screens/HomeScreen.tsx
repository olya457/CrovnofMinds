import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  Image,
  StatusBar,
  Dimensions,
  Animated,
  Easing,
  LayoutChangeEvent,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, QuizLevelKey } from '../navigation/types';
import { CREST_IMAGES, getProfileCrest, CrestKey } from '../store/profileStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const { width, height } = Dimensions.get('window');
const IS_SMALL = Math.min(width, height) < 700 || width <= 360;
const VERY_SMALL = height < 670;

const GOLD = '#E6C980';
const GOLD_BORDER = 'rgba(230,201,128,0.7)';

const BTN_W = Math.min(340, width * 0.82);
const BTN_H = VERY_SMALL ? 42 : IS_SMALL ? 44 : 50;

type NavTarget =
  | { name: 'level1_play' | 'rank' | 'academy' | 'profile' | 'Home' | 'Loader' | 'Onboarding' }
  | { name: 'levels'; params: { level: QuizLevelKey } };

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const buttons = useMemo<ReadonlyArray<{ title: string; target: NavTarget }>>(
    () => [
      { title: 'Start Your Ascent', target: { name: 'level1_play' } },
      { title: 'Hall of Ranks',     target: { name: 'rank' } },
      { title: 'Academy',           target: { name: 'academy' } },
      { title: 'Profile',           target: { name: 'profile' } },
    ],
    []
  );

  const [crest, setCrest] = useState<CrestKey | null>(null);
  const [selected, setSelected] = useState<number>(0);
  const [tops, setTops] = useState<number[]>(Array(buttons.length).fill(0));
  const highlightY = useRef(new Animated.Value(0)).current;
  const sceneOpacity = useRef(new Animated.Value(0)).current;
  const sceneY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(sceneOpacity, { toValue: 1, duration: 450, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(sceneY,       { toValue: 0, duration: 450, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    if (tops[selected] !== undefined) {
      Animated.timing(highlightY, {
        toValue: tops[selected],
        duration: 220,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    }
  }, [selected, tops]);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      (async () => {
        const c = await getProfileCrest();
        if (alive) setCrest(c);
      })();
      return () => { alive = false; };
    }, [])
  );

  const onBtnLayout = (i: number) => (e: LayoutChangeEvent) => {
    const top = e.nativeEvent.layout.y;
    setTops(prev => {
      const next = [...prev];
      next[i] = top;
      return next;
    });
  };

  const navigateTo = (t: NavTarget) => {
    if (t.name === 'levels') navigation.navigate('levels', t.params);
    else navigation.navigate(t.name);
  };

  const press = (i: number, target: NavTarget) => {
    setSelected(i);
    setTimeout(() => navigateTo(target), 180);
  };

  const badgeSrc = crest ? CREST_IMAGES[crest] : CREST_IMAGES['compass'];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <ImageBackground source={require('../assets/background.png')} resizeMode="cover" style={styles.bg}>
        <Animated.View style={[styles.wrap, { opacity: sceneOpacity, transform: [{ translateY: sceneY }] }]}>
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.badgeBtn}
              onPress={() => navigation.navigate('profile')}
              activeOpacity={0.9}
            >
              <Image source={badgeSrc} style={styles.badgeIcon} />
            </TouchableOpacity>
          </View>

          <View style={styles.logoWrap}>
            <Image source={require('../assets/logo.png')} style={styles.logo} />
          </View>

          <View style={styles.menu}>
            <Animated.View
              pointerEvents="none"
              style={[styles.highlight, { transform: [{ translateY: highlightY }] }]}
            />
            {buttons.map((b, i) => {
              const isActive = selected === i;
              return (
                <View key={b.title} onLayout={onBtnLayout(i)} style={styles.btnRow}>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => press(i, b.target)}
                    style={[
                      styles.baseBtn,
                      isActive ? styles.primaryBtn : styles.ghostBtn,
                      isActive && styles.btnActiveBorder,
                    ]}
                  >
                    <Text style={[styles.baseText, isActive ? styles.primaryText : styles.ghostText]}>
                      {b.title}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </Animated.View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0a0a0a' },
  bg: { flex: 1 },
  wrap: { flex: 1, alignItems: 'center' },

  topBar: {
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: IS_SMALL ? 4 : 8,
    alignItems: 'flex-start',
  },
  badgeBtn: {
    width: IS_SMALL ? 38 : 44,
    height: IS_SMALL ? 38 : 44,
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 40,
    borderWidth: 1.2,
    borderColor: GOLD_BORDER,
    backgroundColor: 'rgba(12,10,7,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeIcon: { width: '86%', height: '86%', resizeMode: 'contain' },

  logoWrap: {
    width: '100%',
    alignItems: 'center',
    marginTop: IS_SMALL ? height * 0.01 : height * 0.02,
    marginBottom: VERY_SMALL ? height * 0.025 : IS_SMALL ? height * 0.03 : height * 0.04,
  },
  logo: {
    width: Math.min(380, width * 0.78),
    height: Math.min(220, height * (VERY_SMALL ? 0.20 : IS_SMALL ? 0.22 : 0.25)),
    resizeMode: 'contain',
  },

  menu: { width: '100%', alignItems: 'center', paddingHorizontal: 16, marginTop: IS_SMALL ? 6 : 10 },

  highlight: {
    position: 'absolute',
    left: (width - BTN_W) / 2,
    width: BTN_W,
    height: BTN_H,
    backgroundColor: 'rgba(230,201,128,0.18)',
    borderRadius: 12,
  },

  btnRow: { width: '100%', alignItems: 'center', marginBottom: VERY_SMALL ? 12 : 14 },
  baseBtn: {
    width: BTN_W,
    height: BTN_H,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseText: {
    fontSize: VERY_SMALL ? 14 : IS_SMALL ? 15 : 16,
    fontWeight: '800',
  },

  ghostBtn: {
    borderWidth: 1.2,
    borderColor: GOLD_BORDER,
    backgroundColor: 'rgba(12,10,7,0.55)',
  },
  ghostText: { color: GOLD },

  primaryBtn: {
    backgroundColor: GOLD,
    shadowColor: '#B88D44',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  primaryText: { color: '#17140E' },

  btnActiveBorder: { borderWidth: 1.6, borderColor: GOLD },
});
