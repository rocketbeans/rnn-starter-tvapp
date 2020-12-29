import {
  Navigation,
  Options,
} from 'react-native-navigation';
import { gestureHandlerRootHOC as withGestureHandler } from 'react-native-gesture-handler';

import Screens from './screens';
import { withStoresProvider } from '../../stores';
import { withServicesProvider } from '..';
import useConstants from '../../hooks/useConstants';
import { stores } from '../../stores';
import { Layout_Component, Layout_StackWith } from './layout';

// Here we define "system" methods for Navigation,
// as startApp(), registerScreens(), setDefaultOptions() and others.
// Feel free to change them up your needs.
// However, you will work more with ./index.ts if you'd like to add some other methods.

class NavigationSystem {
  protected initSystem = async () => {
    await this.registerScreens();
    await this.setComponentIdListener();
    await this.setDefaultOptions();
  }

  // APPEARANCE CONFIG

  private registerScreens = async () => {
    Screens.forEach((C, key) => {
      Navigation.registerComponent(
        key,
        () =>
          withGestureHandler(
            withStoresProvider(
              withServicesProvider(C))),
        () => C,
      );
    });
  }

  private setDefaultOptions = async () => {
    const { colors } = useConstants();

    Navigation.setDefaultOptions({
      layout: {
        orientation: ['portrait'],
      },
      bottomTabs: {
        titleDisplayMode: 'alwaysShow',
      },
      bottomTab: {
        iconColor: colors.main,
        textColor: colors.main,
        selectedIconColor: colors.main,
        selectedTextColor: colors.main,
      },
      topBar: {
        largeTitle: {
          visible: true,
        }
      }
    });
  }

  private setComponentIdListener = async () => {
    Navigation.events().registerComponentDidAppearListener(async e => {
      stores.ui.setComponentId(e.componentId);
    });
  }

  // ACTIONS
  
  dismissModal = (cId: string, options?: Options) => {
    Navigation.dismissModal(cId, options);
  }

  dismissAllModals = () => {
    Navigation.dismissAllModals();
  }

  protected push = <T>(cId: string, name: string, passProps?: T, options?: Options) => {
    Navigation.push(cId, Layout_Component(name, passProps, options))
  }

  protected show = <T>(name: string, passProps?: T, options?: Options) => {
    Navigation.showModal(Layout_StackWith(Layout_Component(name, passProps, options)));
  }
}

export default NavigationSystem;