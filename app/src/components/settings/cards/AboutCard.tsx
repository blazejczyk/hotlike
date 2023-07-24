import { useCallback } from 'react';
import { StyleSheet } from 'react-native';

import { TAuthedUser, TAuthedUserUpdatableFields } from '../../../repos/auth';
import SettingsCard from '../SettingsCard';
import SettingsDropdown, { TSettingsDropdownOption } from '../SettingsDropdown';
import SvgIcon from '../../SvgIcon';
import { Activity, Personality } from '../../../services/enums';

type TAboutProps = {
  user: Pick<TAuthedUser, 'activities' | 'personality'>;
  minActivitiesNumber: number;
  maxActivitiesNumber: number;
  onChange: (data: Partial<Pick<TAuthedUser, TAuthedUserUpdatableFields>>) => void;
};

const activitiesOptions: TSettingsDropdownOption<Activity>[] = [
  {
    value: Activity.ART,
    text: 'Art',
  },
  {
    value: Activity.BAR,
    text: 'Bar',
  },
  {
    value: Activity.BBQ,
    text: 'Barbecue',
  },
  {
    value: Activity.BEACH,
    text: 'Beach',
  },
  {
    value: Activity.BILLIARDS,
    text: 'Billiards',
  },
  {
    value: Activity.BOWLING,
    text: 'Bowling',
  },
  {
    value: Activity.CAFE,
    text: 'Cafe',
  },
  {
    value: Activity.CANOEING,
    text: 'Canoeing',
  },
  {
    value: Activity.CINEMA,
    text: 'Cinema',
  },
  {
    value: Activity.CIRCUS,
    text: 'Circus',
  },
  {
    value: Activity.CLIMBING,
    text: 'Climbing',
  },
  {
    value: Activity.CONCERT,
    text: 'Concert',
  },
  {
    value: Activity.CONFECTIONERY,
    text: 'Confectionery',
  },
  {
    value: Activity.COOKING,
    text: 'Cooking',
  },
  {
    value: Activity.CYCLING,
    text: 'Cycling',
  },
  {
    value: Activity.DANCING,
    text: 'Dancing',
  },
  {
    value: Activity.FISHING,
    text: 'Fishing',
  },
  {
    value: Activity.FOOTBALL,
    text: 'Football',
  },
  {
    value: Activity.GAMES,
    text: 'Games',
  },
  {
    value: Activity.GYM,
    text: 'Gym',
  },
  {
    value: Activity.HIKING,
    text: 'Hiking',
  },
  {
    value: Activity.KARAOKE,
    text: 'Karaoke',
  },
  {
    value: Activity.LUNAPARK,
    text: 'Luna-park',
  },
  {
    value: Activity.MALL,
    text: 'Mall',
  },
  {
    value: Activity.MUSEUM,
    text: 'Museum',
  },
  {
    value: Activity.PARK,
    text: 'Park',
  },
  {
    value: Activity.PARTY,
    text: 'Party',
  },
  {
    value: Activity.PINGPONG,
    text: 'Ping-pong',
  },
  {
    value: Activity.PUB,
    text: 'Pub',
  },
  {
    value: Activity.RESTAURANT,
    text: 'Restaurant',
  },
  {
    value: Activity.RUNNING,
    text: 'Running',
  },
  {
    value: Activity.SHOPPING,
    text: 'Shopping',
  },
  {
    value: Activity.SKATING,
    text: 'Skating',
  },
  {
    value: Activity.SNORKELING,
    text: 'Snorkeling',
  },
  {
    value: Activity.SURFING,
    text: 'Surfing',
  },
  {
    value: Activity.SWIMMING,
    text: 'Swimming',
  },
  {
    value: Activity.TELEVISION,
    text: 'Television',
  },
  {
    value: Activity.TENNIS,
    text: 'Tennis',
  },
  {
    value: Activity.THEATER,
    text: 'Theater',
  },
  {
    value: Activity.ZOO,
    text: 'Zoo',
  },
].map((option) => ({
  ...option,
  icon: <SvgIcon scope="activities" name={option.value} width="20" height="20" />
}));

const personalitiesOptions: TSettingsDropdownOption<Personality>[] = [
  {
    value: Personality.INTROVERT,
    text: 'Introvert',
  },
  {
    value: Personality.AMBIVERT,
    text: 'Ambivert',
  },
  {
    value: Personality.EXTROVERT,
    text: 'Extrovert',
  }
];

export default function AboutCard({ user, minActivitiesNumber, maxActivitiesNumber, onChange }: TAboutProps) {
  const handleUpdateActivities = useCallback((activities: Activity[]) => {
    onChange({ activities });
  }, [onChange]);

  const handleUpdatePersonality = useCallback((personality: Personality) => {
    onChange({ personality });
  }, [onChange]);

  return (
    <SettingsCard header="About">
      <SettingsDropdown<Activity>
        multiple
        options={activitiesOptions}
        value={user.activities}
        label="What I like doing"
        onChange={handleUpdateActivities}
        minValuesNumber={minActivitiesNumber}
        maxValuesNumber={maxActivitiesNumber}
      />
      <SettingsDropdown<Personality>
        options={personalitiesOptions}
        value={user.personality}
        label="Personality"
        onChange={handleUpdatePersonality}
        style={styles.personalityDropdown}
      />
    </SettingsCard>
  );
}

const styles = StyleSheet.create({
  personalityDropdown: {
    marginBottom: 0,
  },
});
