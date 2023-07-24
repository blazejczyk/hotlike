import { FC, useMemo } from 'react';
import { SvgProps } from 'react-native-svg';
import { StyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import { ViewStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

import { Activity, Gender } from '../services/enums';

export type TGeneralIconName = 'boy' | 'camera' | 'champagne' | 'cupid' | 'girl' | 'head' | 'lock' | 'message' | 'path' | 'pin' | 'plug' | 'signal' | 'target';

export type TIconScope = 'genders' | 'activities' | 'general';
export type TIconName = Gender | Activity | TGeneralIconName;

type TScopeProps<S extends TIconScope, N extends TIconName> = { scope: S; name: N; };

type TSvgIconProps = {
  width: number | string;
  height: number | string;
  style?: StyleProp<ViewStyle>;
} & (
  TScopeProps<'genders', Gender> |
  TScopeProps<'activities', Activity> |
  TScopeProps<'general', TGeneralIconName>
);

type TSvgMap<T extends string> = Record<T, () => FC<SvgProps>>;

// Svg files must be mapped like below because React Native doesn't support dynamic imports by design.

const genderSvg: TSvgMap<Gender> = {
  [Gender.MALE]: () => require('../../assets/icons/genders/male.svg').default,
  [Gender.FEMALE]: () => require('../../assets/icons/genders/female.svg').default,
};

const activitySvg: TSvgMap<Activity> = {
  [Activity.ART]: () => require('../../assets/icons/activities/art.svg').default,
  [Activity.BAR]: () => require('../../assets/icons/activities/bar.svg').default,
  [Activity.BBQ]: () => require('../../assets/icons/activities/bbq.svg').default,
  [Activity.BEACH]: () => require('../../assets/icons/activities/beach.svg').default,
  [Activity.BILLIARDS]: () => require('../../assets/icons/activities/billiards.svg').default,
  [Activity.BOWLING]: () => require('../../assets/icons/activities/bowling.svg').default,
  [Activity.CAFE]: () => require('../../assets/icons/activities/cafe.svg').default,
  [Activity.CANOEING]: () => require('../../assets/icons/activities/canoeing.svg').default,
  [Activity.CINEMA]: () => require('../../assets/icons/activities/cinema.svg').default,
  [Activity.CIRCUS]: () => require('../../assets/icons/activities/circus.svg').default,
  [Activity.CLIMBING]: () => require('../../assets/icons/activities/climbing.svg').default,
  [Activity.CONCERT]: () => require('../../assets/icons/activities/concert.svg').default,
  [Activity.CONFECTIONERY]: () => require('../../assets/icons/activities/confectionery.svg').default,
  [Activity.COOKING]: () => require('../../assets/icons/activities/cooking.svg').default,
  [Activity.CYCLING]: () => require('../../assets/icons/activities/cycling.svg').default,
  [Activity.DANCING]: () => require('../../assets/icons/activities/dancing.svg').default,
  [Activity.FISHING]: () => require('../../assets/icons/activities/fishing.svg').default,
  [Activity.FOOTBALL]: () => require('../../assets/icons/activities/football.svg').default,
  [Activity.GAMES]: () => require('../../assets/icons/activities/games.svg').default,
  [Activity.GYM]: () => require('../../assets/icons/activities/gym.svg').default,
  [Activity.HIKING]: () => require('../../assets/icons/activities/hiking.svg').default,
  [Activity.KARAOKE]: () => require('../../assets/icons/activities/karaoke.svg').default,
  [Activity.LUNAPARK]: () => require('../../assets/icons/activities/lunapark.svg').default,
  [Activity.MALL]: () => require('../../assets/icons/activities/mall.svg').default,
  [Activity.MUSEUM]: () => require('../../assets/icons/activities/museum.svg').default,
  [Activity.PARK]: () => require('../../assets/icons/activities/park.svg').default,
  [Activity.PARTY]: () => require('../../assets/icons/activities/party.svg').default,
  [Activity.PINGPONG]: () => require('../../assets/icons/activities/pingpong.svg').default,
  [Activity.PUB]: () => require('../../assets/icons/activities/pub.svg').default,
  [Activity.RESTAURANT]: () => require('../../assets/icons/activities/restaurant.svg').default,
  [Activity.RUNNING]: () => require('../../assets/icons/activities/running.svg').default,
  [Activity.SHOPPING]: () => require('../../assets/icons/activities/shopping.svg').default,
  [Activity.SKATING]: () => require('../../assets/icons/activities/skating.svg').default,
  [Activity.SNORKELING]: () => require('../../assets/icons/activities/snorkeling.svg').default,
  [Activity.SURFING]: () => require('../../assets/icons/activities/surfing.svg').default,
  [Activity.SWIMMING]: () => require('../../assets/icons/activities/swimming.svg').default,
  [Activity.TELEVISION]: () => require('../../assets/icons/activities/television.svg').default,
  [Activity.TENNIS]: () => require('../../assets/icons/activities/tennis.svg').default,
  [Activity.THEATER]: () => require('../../assets/icons/activities/theater.svg').default,
  [Activity.ZOO]: () => require('../../assets/icons/activities/zoo.svg').default,
};

const generalSvg: TSvgMap<TGeneralIconName> = {
  boy: () => require('../../assets/icons/general/boy.svg').default,
  camera: () => require('../../assets/icons/general/camera.svg').default,
  champagne: () => require('../../assets/icons/general/champagne.svg').default,
  cupid: () => require('../../assets/icons/general/cupid.svg').default,
  girl: () => require('../../assets/icons/general/girl.svg').default,
  head: () => require('../../assets/icons/general/head.svg').default,
  lock: () => require('../../assets/icons/general/lock.svg').default,
  message: () => require('../../assets/icons/general/message.svg').default,
  path: () => require('../../assets/icons/general/path.svg').default,
  pin: () => require('../../assets/icons/general/pin.svg').default,
  plug: () => require('../../assets/icons/general/plug.svg').default,
  signal: () => require('../../assets/icons/general/signal.svg').default,
  target: () => require('../../assets/icons/general/target.svg').default,
};

export default function SvgIcon({ scope, name, width, height, style }: TSvgIconProps): JSX.Element | null {
  const Svg = useMemo<FC<SvgProps> | null>(() => {
    switch (scope) {
      case 'genders':
        return genderSvg[name]();
      case 'activities':
        return activitySvg[name]();
      case 'general':
        return generalSvg[name]();
      default:
        return null;
    }
  }, [scope, name]);
  return Svg ? <Svg width={width} height={height} style={style} /> : null;
}
