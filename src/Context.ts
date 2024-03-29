import { createContext } from 'react';
import { theme } from '@styles/theme';

const { lightTheme } = theme;

const userContextDefaultValue: IUserContext = {
  userObj: undefined,
  refreshUser: () => {},
};

export const UserContext = createContext<IUserContext>(userContextDefaultValue);

export const ThemeContext = createContext({
  theme: lightTheme,
  toggleTheme: (): void => {},
});
