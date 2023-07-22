import { useCallback, useEffect, useMemo, useState } from 'react';
import { BackHandler, Keyboard, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack/src/types';
import { useFocusEffect } from '@react-navigation/native';
import { Icon, ProgressBar, Text, useTheme, ViewPager } from '@ui-kitten/components';
import { isEqual } from 'lodash';
import format from 'date-fns/format';

import { TPublicScopeNavigator } from '../../../services/navs';
import ScreenContainer from '../../../components/ScreenContainer';
import useConfirm from '../../../hooks/useConfirm';
import IdentityStep, { maxDateOfBirth } from './steps/IdentityStep';
import PhotoStep from './steps/PhotoStep';
import SettingsStep from './steps/SettingsStep';
import AuthStep from './steps/AuthStep';
import FinishStep from './steps/FinishStep';
import { Body, Gender, Personality, TRegisteredAuthedUser, createAuthedUser } from '../../../repos/auth';
import useConstantsLoader from '../../../hooks/loaders/useConstantsLoader';
import Loading from '../../../components/Loading';
import LoadingError from '../../../components/LoadingError';
import { isValidEmail, isValidPassword } from '../../../services/utils';
import useSaver from '../../../hooks/useSaver';

const defaultRegisteredAuthedUser: TRegisteredAuthedUser = {
  email: '',
  name: '',
  gender: Gender.MALE,
  dateOfBirth: format(maxDateOfBirth, 'yyyy-MM-dd'),
  height: 165,
  body: Body.AVERAGE,
  smoking: false,
  activities: [],
  personality: Personality.AMBIVERT,
  goals: [],
  hasKids: false,
  preferredGenders: [],
  prefersTaller: false,
  prefersShorter: false,
  rejectsSmoking: false,
  rejectsKids: false,
  latitude: '0',
  longitude: '0',
  photoFile: '',
};

type TRegistrationScreenProps = StackScreenProps<TPublicScopeNavigator, 'registrationScreen'>;

export default function RegistrationScreen({ navigation }: TRegistrationScreenProps): JSX.Element {
  const theme = useTheme();
  const confirm = useConfirm();
  const [selectedStep, setSelectedStep] = useState<number>(0);
  const [registeredAuthedUser, setRegisteredAuthedUser] = useState<TRegisteredAuthedUser>(defaultRegisteredAuthedUser);
  const [initializedSteps, setInitializedSteps] = useState<Set<number>>(new Set([0]));
  const { result: constants, loading: loadingConstants, error: constantsLoadingError, load: reloadConstants } = useConstantsLoader();
  const { loading: registeringAuthedUser, error: registrationError, save: registerAuthedUser } = useSaver(async () => {
    const {
      name, gender, dateOfBirth, height, body, smoking, activities, personality, goals, hasKids, preferredGenders,
      prefersTaller, prefersShorter, rejectsSmoking, rejectsKids, latitude, longitude, photoFile, email, password, fbToken,
    } = registeredAuthedUser;
    await createAuthedUser(
      name, gender, dateOfBirth, height, body, smoking, activities, personality, goals, hasKids, preferredGenders,
      prefersTaller, prefersShorter, rejectsSmoking, rejectsKids, latitude, longitude, photoFile, email, password, fbToken,
    );
    handleNextStep();
  });

  const handleChangeRegisteredAuthedUser = useCallback((data: Partial<TRegisteredAuthedUser>) => {
    setRegisteredAuthedUser((currentRegisteredAuthedUser) => ({ ...currentRegisteredAuthedUser, ...data }));
  }, []);

  const shouldRenderStep = useCallback((step: number) => step === selectedStep, [selectedStep]);

  const handlePreviousStep = useCallback(() => setSelectedStep((currentStep) => currentStep - 1), []);

  const handleNextStep = useCallback(() => {
    const nextStep = selectedStep + 1;
    setSelectedStep(nextStep);
    setInitializedSteps((currentInitializedSteps) => {
      const nextInitializedSteps = new Set(currentInitializedSteps);
      if (!nextInitializedSteps.has(nextStep)) {
        nextInitializedSteps.add(nextStep);
      }
      return nextInitializedSteps;
    });
  }, [selectedStep]);

  const handleFinishRegistration = useCallback(() => {
    navigation.navigate('loginScreen');
  }, [navigation]);

  const handleCancelRegistration = useCallback(() => {
    if (isEqual(registeredAuthedUser, defaultRegisteredAuthedUser)) {
      navigation.goBack();
      return;
    }
    confirm('Are you sure you want to cancel registration?', navigation.goBack);
  }, [confirm, navigation, registeredAuthedUser]);

  const handleFocusEffect = useCallback(() => {
    const onBackPress = () => {
      handleCancelRegistration();
      return true;
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [handleCancelRegistration]);

  useFocusEffect(handleFocusEffect);

  const registrationProgressLinkText = useMemo(() => ({ color: theme['color-basic-700'] }), [theme]);

  const steps = useMemo<{ complete: boolean, component: JSX.Element }[]>(() => {
    if (!constants) {
      return [];
    }
    const identityStepComplete = (['name', 'gender', 'dateOfBirth'] as (keyof TRegisteredAuthedUser)[]).every((key) => registeredAuthedUser[key]);
    const photoStepComplete = Boolean(registeredAuthedUser.photoFile);
    const settingsStepComplete = (['height', 'body', 'personality'] as (keyof TRegisteredAuthedUser)[]).every((key) => registeredAuthedUser[key]) &&
      (['smoking', 'hasKids', 'prefersTaller', 'prefersShorter', 'rejectsSmoking', 'rejectsKids'] as (keyof TRegisteredAuthedUser)[]).every((key) => registeredAuthedUser[key] !== undefined) &&
      registeredAuthedUser.activities.length > 0 && registeredAuthedUser.goals.length > 0 && registeredAuthedUser.preferredGenders.length > 0;
    // const authStepComplete = Boolean(
    //   (registeredAuthedUser.email && registeredAuthedUser.password &&
    //     isValidEmail(registeredAuthedUser.email) &&
    //     isValidPassword(registeredAuthedUser.password, constants.users.minPasswordLength, constants.users.maxPasswordLength)
    //   ) || registeredAuthedUser.fbToken
    // );
    const authStepComplete = Boolean(
      registeredAuthedUser.email && isValidEmail(registeredAuthedUser.email) &&
      ((registeredAuthedUser.password && isValidPassword(registeredAuthedUser.password, constants.users.minPasswordLength, constants.users.maxPasswordLength)) || registeredAuthedUser.fbToken)
    );
    return [
      {
        complete: identityStepComplete,
        component: (
          <IdentityStep
            key="identityStep"
            registeredAuthedUser={registeredAuthedUser}
            onChange={handleChangeRegisteredAuthedUser}
            onComplete={identityStepComplete ? handleNextStep : undefined}
          />
        ),
      },
      {
        complete: photoStepComplete,
        component: (
          <PhotoStep
            key="photoStep"
            registeredAuthedUser={registeredAuthedUser}
            photosConstants={constants.photos}
            onChange={handleChangeRegisteredAuthedUser}
            onComplete={photoStepComplete ? handleNextStep : undefined}
          />
        ),
      },
      {
        complete: settingsStepComplete,
        component: (
          <SettingsStep
            key="settingsStep"
            registeredAuthedUser={registeredAuthedUser}
            usersConstants={constants.users}
            onChange={handleChangeRegisteredAuthedUser}
            onComplete={settingsStepComplete ? handleNextStep : undefined}
          />
        ),
      },
      {
        complete: authStepComplete,
        component: (
          <AuthStep
            key="authStep"
            registeredAuthedUser={registeredAuthedUser}
            registering={registeringAuthedUser}
            registrationError={registrationError}
            onChange={handleChangeRegisteredAuthedUser}
            onComplete={authStepComplete ? registerAuthedUser : undefined}
          />
        ),
      },
      {
        complete: false,
        component: (
          <FinishStep
            key="finishStep"
            registeredAuthedUser={registeredAuthedUser}
            onComplete={handleFinishRegistration}
          />
        ),
      },
    ];
  }, [constants, handleChangeRegisteredAuthedUser, handleNextStep, handleFinishRegistration, registerAuthedUser, registeredAuthedUser, registeringAuthedUser]);

  return (
    <ScreenContainer>
      {loadingConstants && !constants && <Loading />}
      {constantsLoadingError && !constants && <LoadingError onReload={reloadConstants} />}
      {constants && (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.registrationContent}>
            <ViewPager
              selectedIndex={selectedStep}
              onSelect={setSelectedStep}
              shouldLoadComponent={shouldRenderStep}
              swipeEnabled={false}
              style={styles.stepContent}
            >
              {steps.map(({ component }) => component)}
            </ViewPager>
            <View style={styles.registrationProgress}>
              <ProgressBar progress={selectedStep / (steps.length - 1)} />
              <View style={styles.registrationProgressInfo}>
                {(selectedStep > 0 && selectedStep !== steps.length - 1)
                  ? (
                    <TouchableOpacity onPress={handlePreviousStep}>
                      <Icon name="arrow-back-outline" fill={theme['color-basic-700']} style={styles.registrationProgressLinkArrow} />
                    </TouchableOpacity>
                  )
                  : <View style={styles.registrationProgressLinkArrow} />
                }
                {/*{(selectedStep < steps.length - 1) && (*/}
                {/*  <TouchableOpacity onPress={handleCancelRegistration}>*/}
                {/*    <Text category="s2" style={registrationProgressLinkText}>*/}
                {/*      {(selectedStep === 0 && initializedSteps.size === 1) ? 'I already have my account' : 'Cancel registration'}*/}
                {/*    </Text>*/}
                {/*  </TouchableOpacity>*/}
                {/*)}*/}
                <TouchableOpacity onPress={handleCancelRegistration}>
                  <Text category="s2" style={registrationProgressLinkText}>
                    {(selectedStep === 0 && initializedSteps.size === 1) ? 'I already have my account' : 'Cancel registration'}
                  </Text>
                </TouchableOpacity>
                {((selectedStep < steps.length - 2) && initializedSteps.has(selectedStep + 1) && steps[selectedStep].complete)
                  ? (
                    <TouchableOpacity onPress={handleNextStep}>
                      <Icon name="arrow-forward-outline" fill={theme['color-basic-700']} style={styles.registrationProgressLinkArrow} />
                    </TouchableOpacity>
                  )
                  : <View style={styles.registrationProgressLinkArrow} />
                }
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  registrationContent: {
    flex: 1,
  },
  stepContent: {
    flex: 1,
  },
  registrationProgress: {
    marginTop: 5,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  registrationProgressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  registrationProgressLinkArrow: {
    width: 18,
    height: 18,
  },
});
