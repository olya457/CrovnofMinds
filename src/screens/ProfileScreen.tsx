import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Animated,
  Easing,
  StatusBar,
  Image,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  StyleProp,
  ViewStyle,
  ImageStyle,
  TextStyle,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import {
  CREST_IMAGES,
  CrestKey,
  getProfileCrest,
  setProfileCrest,
  getProfileName,
  setProfileName,
  getCurrentRankTitle,
} from '../store/profileStore';

type Props = NativeStackScreenProps<RootStackParamList, 'profile'>;

const { width, height } = Dimensions.get('window');
const IS_SMALL = Math.min(width, height) < 700 || width <= 360;
const VERY_SMALL = height < 670;

const GOLD = '#E6C980';
const GOLD_BORDER = 'rgba(230,201,128,0.62)';
const BTN_W = Math.min(360, width * 0.9);
const BTN_H = VERY_SMALL ? 44 : IS_SMALL ? 46 : 52;

const sTopRow = (gridW: number): StyleProp<ViewStyle> => ({
  width: gridW,
  flexDirection: 'row',
  alignItems: 'center',
  gap: 14,
  marginBottom: VERY_SMALL ? 10 : 14,
});
const sPreviewBox = (size: number): StyleProp<ViewStyle> => ({
  width: size,
  height: size,
  borderRadius: 14,
  borderWidth: 1.2,
  borderColor: GOLD_BORDER,
  backgroundColor: 'rgba(12,10,7,0.7)',
  alignItems: 'center',
  justifyContent: 'center',
});
const sPreviewImg = (size: number): StyleProp<ImageStyle> => ({
  width: size * 0.8,
  height: size * 0.8,
  resizeMode: 'contain',
});
const sGrid = (gridW: number): StyleProp<ViewStyle> => ({
  width: gridW,
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  rowGap: VERY_SMALL ? 12 : 16,
  columnGap: 12,
  marginTop: VERY_SMALL ? 8 : 12,
  marginBottom: VERY_SMALL ? 10 : 14,
});
const sCrestCell = (cellW: number): StyleProp<ViewStyle> => ({
  width: cellW,
  alignItems: 'center',
  paddingVertical: VERY_SMALL ? 8 : 10,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: 'transparent',
  backgroundColor: 'rgba(12,10,7,0.40)',
});

const CRESTS: Array<{ key: CrestKey; title: string }> = [
  { key: 'crown',   title: 'The Crown'  },
  { key: 'book',    title: 'The Book'   },
  { key: 'compass', title: 'The Compass'},
  { key: 'torch',   title: 'The Torch'  },
  { key: 'quill',   title: 'The Quill'  },
  { key: 'sword',   title: 'The Sword'  },
];

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [crest, setCrest] = useState<CrestKey | null>(null);
  const [rankTitle, setRankTitle] = useState('Page');

  const nameRef = useRef<TextInput>(null);

  const headerFade = useRef(new Animated.Value(0)).current;
  const headerY    = useRef(new Animated.Value(12)).current;
  const topFade    = useRef(new Animated.Value(0)).current;
  const topY       = useRef(new Animated.Value(12)).current;
  const gridFade   = useRef(new Animated.Value(0)).current;
  const gridY      = useRef(new Animated.Value(12)).current;
  const homeFade   = useRef(new Animated.Value(0)).current;
  const homeY      = useRef(new Animated.Value(10)).current;

  const itemFades = useRef(CRESTS.map(() => new Animated.Value(0))).current;
  const itemY     = useRef(CRESTS.map(() => new Animated.Value(8))).current;

  const savedFade = useRef(new Animated.Value(0)).current;
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    (async () => {
      const [n, c, r] = await Promise.all([getProfileName(), getProfileCrest(), getCurrentRankTitle()]);
      setName(n);
      setCrest(c);
      setRankTitle(r);
    })();

    Animated.stagger(80, [
      Animated.parallel([
        Animated.timing(headerFade, { toValue: 1, duration: 320, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(headerY,    { toValue: 0, duration: 320, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(topFade,    { toValue: 1, duration: 320, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(topY,       { toValue: 0, duration: 320, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(gridFade,   { toValue: 1, duration: 320, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(gridY,      { toValue: 0, duration: 320, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(homeFade,   { toValue: 1, duration: 280, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(homeY,      { toValue: 0, duration: 280, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
    ]).start(() => {
      Animated.stagger(
        60,
        itemFades.map((v, i) =>
          Animated.parallel([
            Animated.timing(v,        { toValue: 1, duration: 260, useNativeDriver: true }),
            Animated.timing(itemY[i], { toValue: 0, duration: 260, useNativeDriver: true }),
          ])
        )
      ).start();
    });

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  const showSaved = () => {
    savedFade.stopAnimation();
    Animated.sequence([
      Animated.timing(savedFade, { toValue: 1, duration: 140, useNativeDriver: true }),
      Animated.timing(savedFade, { toValue: 0, duration: 300, delay: 1200, useNativeDriver: true }),
    ]).start();
  };

  const select = async (k: CrestKey) => {
    setCrest(k);
    await setProfileCrest(k);
    showSaved();
  };

  const persistName = async (v: string) => {
    if (v.trim().length > 0) {
      await setProfileName(v.trim());
      showSaved();
    }
  };

  const onNameChange = (v: string) => {
    setName(v);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => persistName(v), 300);
  };

  const handleSubmitName = async () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    await persistName(name);
    Keyboard.dismiss();
  };

  const previewSource = crest ? CREST_IMAGES[crest] : CREST_IMAGES['compass'];
  const PREV_W = Math.min(IS_SMALL ? 108 : 120, width * 0.28);
  const GRID_W = Math.min(380, width * 0.92);
  const CELL_W = (GRID_W - 12) / 3 - 4;

  const header = useMemo(() => (
    <Animated.View style={{ opacity: headerFade, transform: [{ translateY: headerY }] }}>
      <View style={styles.header}>
        <View style={styles.line} />
        <Text style={styles.title}>MY CREST</Text>
        <View style={styles.line} />
      </View>
    </Animated.View>
  ), []);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <ImageBackground source={require('../assets/background.png')} resizeMode="cover" style={styles.bg}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={{ height: 36 }} />
            {header}

            <Animated.View style={[sTopRow(GRID_W), { opacity: topFade, transform: [{ translateY: topY }] }]}>
              <View style={sPreviewBox(PREV_W)}>
                <Image source={previewSource} style={sPreviewImg(PREV_W)} />
              </View>

              <View style={{ flex: 1 }}>
                <TextInput
                  ref={nameRef}
                  value={name}
                  onChangeText={onNameChange}
                  onSubmitEditing={handleSubmitName}
                  placeholder="Name"
                  placeholderTextColor="rgba(230,201,128,0.6)"
                  maxLength={24}
                  style={styles.nameInput}
                  autoCorrect={false}
                  autoCapitalize="words"
                  returnKeyType="done"
                  blurOnSubmit
                  enablesReturnKeyAutomatically
                  textContentType={Platform.OS === 'ios' ? 'name' : 'none'}
                  selectionColor={GOLD}
                />

                <Text style={styles.rankText}>
                  Current Rank: <Text style={{ fontWeight: '900' }}>{rankTitle}</Text>
                </Text>

                <Animated.View style={[styles.savedPill, { opacity: savedFade }]} pointerEvents="none">
                  <Text style={styles.savedText}>Saved</Text>
                </Animated.View>
              </View>
            </Animated.View>

            <Animated.View style={{ opacity: gridFade, transform: [{ translateY: gridY }] }}>
              <View style={sGrid(GRID_W)}>
                {CRESTS.map(({ key, title }, i) => {
                  const active = crest === key;
                  return (
                    <Animated.View
                      key={key}
                      style={{ opacity: itemFades[i], transform: [{ translateY: itemY[i] }] }}
                    >
                      <TouchableOpacity
                        onPress={() => select(key)}
                        activeOpacity={0.9}
                        style={[sCrestCell(CELL_W), active && styles.crestCellActive]}
                      >
                        <Image source={CREST_IMAGES[key]} style={styles.crestImg} />
                        <Text style={[styles.crestTitle, active && styles.crestTitleActive]} numberOfLines={1}>
                          {title}
                        </Text>
                      </TouchableOpacity>
                    </Animated.View>
                  );
                })}
              </View>
            </Animated.View>

            <Animated.View style={{ opacity: homeFade, transform: [{ translateY: homeY }] }}>
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.homeBtn}
                onPress={() => navigation.navigate('Home')}
              >
                <Text style={styles.homeText}>HOME</Text>
              </TouchableOpacity>
            </Animated.View>

            <View style={{ height: 24 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0b0b0f' },
  bg: { flex: 1 },
  scrollContent: { alignItems: 'center' },

  header: {
    width: Math.min(380, width * 0.92),
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: VERY_SMALL ? 8 : 10,
  } as ViewStyle,
  line: { flex: 1, height: 1, backgroundColor: 'rgba(230,201,128,0.35)' } as ViewStyle,
  title: {
    color: GOLD,
    fontSize: VERY_SMALL ? 18 : IS_SMALL ? 22 : 24,
    fontWeight: '800',
    letterSpacing: 2,
  } as TextStyle,

  nameInput: {
    height: VERY_SMALL ? 40 : 44,
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: GOLD_BORDER,
    paddingHorizontal: 12,
    color: GOLD,
    fontWeight: '800',
    backgroundColor: 'rgba(12,10,7,0.55)',
  } as TextStyle,
  rankText: { marginTop: 8, color: '#E8E0CF', fontSize: IS_SMALL ? 12.5 : 13.5 } as TextStyle,

  savedPill: {
    position: 'absolute',
    right: 8,
    top: VERY_SMALL ? -18 : -20,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: 'rgba(230,201,128,0.25)',
  } as ViewStyle,
  savedText: { color: GOLD, fontSize: 11, fontWeight: '800' } as TextStyle,

  crestCellActive: {
    borderColor: GOLD_BORDER,
    backgroundColor: 'rgba(30, 38, 26, 0.62)',
    shadowColor: GOLD,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  } as ViewStyle,
  crestImg: { width: 54, height: 54, resizeMode: 'contain', marginBottom: 6 } as ImageStyle,
  crestTitle: { color: GOLD, fontWeight: '700', fontSize: 12, opacity: 0.85 } as TextStyle,
  crestTitleActive: { opacity: 1 } as TextStyle,

  homeBtn: {
    marginTop: VERY_SMALL ? 8 : 12,
    width: BTN_W,
    height: BTN_H,
    borderRadius: BTN_H / 2,
    borderWidth: 1.2,
    borderColor: GOLD_BORDER,
    backgroundColor: GOLD,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#B88D44',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  } as ViewStyle,
  homeText: {
    color: '#17140E',
    fontSize: VERY_SMALL ? 15 : IS_SMALL ? 15.5 : 17,
    fontWeight: '900',
    letterSpacing: 0.2,
  } as TextStyle,
});
