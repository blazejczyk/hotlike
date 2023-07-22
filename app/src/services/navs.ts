import { NavigatorScreenParams } from '@react-navigation/native';

export type TPublicScopeNavigator = {
  loginScreen: undefined;
  registrationScreen: undefined;
  passwordReminderScreen: undefined;
};

export type TRestrictedScopeNavigator = {
  homeNavigator: NavigatorScreenParams<THomeNavigator>;
  suggestionsNavigator: NavigatorScreenParams<TSuggestionsNavigator>;
  profileScreen: undefined;
};

export type THomeNavigator = {
  mapScreen: undefined;
  invitationScreen: undefined;
  ongoingMeetingScreen: {
    tab: OngoingMeetingTabIndex | null;
  };
};

export type TSuggestionsNavigator = {
  suggestionsScreen: undefined;
  suggestionScreen: {
    userId: string;
    placeId: string;
  };
};

export enum OngoingMeetingTabIndex {
  DETAILS,
  MESSAGES,
}
