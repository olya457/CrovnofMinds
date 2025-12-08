import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  Dimensions,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const { width, height } = Dimensions.get('window');
const IS_SMALL = width <= 360 || height < 600;

type Slide = { key: string; title: string; text: string; button: string; hero: number };

const SLIDES: Slide[] = [
  {
    key: 'path',
    title: 'The Path of Strength',
    text:
      'Every athlete starts with a single step.\n' +
      'Follow the road of discipline and push \n' +
      'your limits to reach the top.',
    button: 'CONTINUE',
    hero: require('../assets/ob_path.png'),
  },
  {
    key: 'chess',
    title: 'Challenge the Players',
    text:
      'Each match is a test of speed and focus.\n' +
      'React fast, think sharp, and outscore your \n' +
      'opponent.',
    button: 'NEXT',
    hero: require('../assets/ob_chess.png'),
  },
  {
    key: 'academy',
    title: 'Academy of Skill',
    text: 'Hone your reaction, strategy, and precision.\n' +
    'Train here to sharpen both mind and technique.',
    button: 'NEXT',
    hero: require('../assets/ob_academy.png'),
  },
  {
    key: 'throne',
    title: 'Claim the Trophy',
    text:
      'Defeat the final challenger..\n' +
      'Prove your mastery and rise as the champion.',
    button: 'BEGIN DUEL',
    hero: require('../assets/ob_throne.png'),
  },
];

const GOLD = '#e6c980';
const GOLD_BORDER = 'rgba(230, 201, 128, 0.55)';
const PANEL_BG = 'rgba(12, 10, 7, 1)';

const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList<Slide>>(null);

  const goTo = (i: number) => {
    setIndex(i);
    listRef.current?.scrollToIndex({ index: i, animated: true });
  };

  const onNext = () => {
    if (index < SLIDES.length - 1) {
      goTo(index + 1);
    } else {
      navigation.replace('Home');
    }
  };

  useEffect(() => {
    listRef.current?.scrollToIndex({ index: 0, animated: false });
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ImageBackground source={require('../assets/background1.png')} style={styles.bg} resizeMode="cover">
        <FlatList
          ref={listRef}
          data={SLIDES}
          keyExtractor={(it) => it.key}
          horizontal
          pagingEnabled
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index: i }) => (
            <SlideItem item={item} isActive={i === index} onNext={onNext} />
          )}
        />
      </ImageBackground>
    </SafeAreaView>
  );
};

export default OnboardingScreen;

const SlideItem = ({
  item,
  onNext,
  isActive,
}: {
  item: Slide;
  onNext: () => void;
  isActive: boolean;
}) => {
  const heroOpacity = useRef(new Animated.Value(0)).current;
  const heroY = useRef(new Animated.Value(16)).current;
  const panelOpacity = useRef(new Animated.Value(0)).current;
  const panelY = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    if (isActive) {
      Animated.parallel([
        Animated.timing(heroOpacity, { toValue: 1, duration: 420, useNativeDriver: true }),
        Animated.timing(heroY, { toValue: 0, duration: 420, useNativeDriver: true }),
        Animated.timing(panelOpacity, { toValue: 1, duration: 420, delay: 120, useNativeDriver: true }),
        Animated.timing(panelY, { toValue: 0, duration: 420, delay: 120, useNativeDriver: true }),
      ]).start();
    } else {
      heroOpacity.setValue(0);
      heroY.setValue(16);
      panelOpacity.setValue(0);
      panelY.setValue(24);
    }
  }, [isActive, heroOpacity, heroY, panelOpacity, panelY]);

  const SHIFT_UP = IS_SMALL ? 20 : 40; 
  const HERO_ZONE = IS_SMALL ? 0.6 : 0.8; 

  const baseW = width * (IS_SMALL ? 0.9 : 0.98);
  const baseH = height * (IS_SMALL ? 0.5 : 0.7); 
  
  const ADD_HEIGHT = IS_SMALL ? 30 : 70; 
  const ADD_SIDE_TOTAL = IS_SMALL ? 20 : 40; 
  
  const HERO_W = Math.min(baseW + ADD_SIDE_TOTAL, width);
  const HERO_H = Math.min(baseH + ADD_HEIGHT, height * 0.92);

  const PANEL_MIN_HEIGHT = IS_SMALL ? 180 : 220;
  const PANEL_HEIGHT = Math.min(300, Math.max(PANEL_MIN_HEIGHT, height * (IS_SMALL ? 0.3 : 0.34))); 
  
  const PANEL_TOP_MARGIN = IS_SMALL ? -40 : -52; 

  return (
    <View style={{ width, height }}>
      <Animated.View
        style={[
          styles.heroWrap,
          {
            height: height * HERO_ZONE,
            opacity: heroOpacity,
            transform: [{ translateY: heroY }],
            marginTop: -SHIFT_UP,
          },
        ]}
      >
        <Image source={item.hero} style={[styles.heroImg, { width: HERO_W, height: HERO_H }]} />
      </Animated.View>

      <Animated.View 
        style={[
          styles.panelWrap, 
          { 
            opacity: panelOpacity, 
            transform: [{ translateY: panelY }],
            marginTop: PANEL_TOP_MARGIN, 
          }
        ]}
      >
        <View style={[styles.panel, { height: PANEL_HEIGHT }]}>
          <Text style={[styles.title, IS_SMALL && { fontSize: 16, marginBottom: 6 }]}>{item.title}</Text>
          <Text style={[styles.text, IS_SMALL && { fontSize: 12, lineHeight: 18 }]}>{item.text}</Text>
          
          <TouchableOpacity 
            style={[styles.btn, IS_SMALL && { marginTop: 12, paddingVertical: 10, paddingHorizontal: 20 }]} 
            onPress={onNext}
          >
            <Text style={[styles.btnText, IS_SMALL && { fontSize: 14 }]}>{item.button}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0a0a0a' },
  bg: { flex: 1 },
  heroWrap: { width: '100%', alignItems: 'center', justifyContent: 'flex-end', paddingTop: IS_SMALL ? 0 : 6 },
  heroImg: { resizeMode: 'cover' },
  panelWrap: { paddingHorizontal: IS_SMALL ? 10 : 20, paddingBottom: IS_SMALL ? 10 : 20 },
  panel: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    backgroundColor: PANEL_BG,
    borderWidth: 1.5,
    borderColor: GOLD_BORDER,
    paddingHorizontal: IS_SMALL ? 12 : 18,
    paddingTop: IS_SMALL ? 12 : 16,
    alignItems: 'center',
  },
  title: { color: GOLD, fontSize: 20, fontWeight: '800', marginBottom: 10, textAlign: 'center' },
  text: { color: '#e8e0cf', fontSize: 14, lineHeight: 20, textAlign: 'center', opacity: 0.92 },
  btn: {
    marginTop: 18,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: GOLD,
    shadowColor: GOLD,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  btnText: { color: '#14120b', fontWeight: '800', fontSize: 15 },
});