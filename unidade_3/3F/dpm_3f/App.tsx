import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import * as React from 'react'

import 'react-native-gesture-handler'
import {enableScreens} from 'react-native-screens'
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet'
import {StatusBar} from 'expo-status-bar'

import {SCREENS} from './src/SCREENS'
import CodePushWrapper from './src/wrappers/CodePushWrapper'
import getScreenAnimation, {SCREEN_ANIMATION} from './src/config/getScreenAnimation'
import KeyboardWrapper from './components/KeyboardWrapper'

// Exemplo obtido a partir do seguinte tutorial
//https://www.npmjs.com/package/react-native-accelerometer-parallax/v/1.6.1

enableScreens(false)
const Stack = createStackNavigator()

const App = () => {
  return (
    <CodePushWrapper>
      <StatusBar translucent />
      <BottomSheetModalProvider>
        <KeyboardWrapper>
          <NavigationContainer>
            <Stack.Navigator detachInactiveScreens={false} headerMode={'screen'}>
              {Object.entries(SCREENS).map(([screenName, screenComponent], index) => {
                return (
                  <Stack.Screen
                    options={{...getScreenAnimation(SCREEN_ANIMATION.LEFT, false), headerShown: true}}
                    key={index}
                    name={screenName}
                    component={screenComponent}
                  />
                )
              })}
            </Stack.Navigator>
          </NavigationContainer>
        </KeyboardWrapper>
      </BottomSheetModalProvider>
    </CodePushWrapper>
  )
}

export default App
