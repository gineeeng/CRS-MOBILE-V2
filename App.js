import { StatusBar } from "expo-status-bar";
import { Image } from "react-native";
import { Colors } from "./constants/Colors";
import { useContext } from "react";
import { MenuProvider } from "react-native-popup-menu";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import AuthContextProvider, { AuthContext } from "./context/authContext";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import Report from "./screens/Report";
import Register from "./screens/Register";
import Login from "./screens/Login";
import Hotline from "./screens/Hotline";
import MenuBtn from "./components/global/MenuBtn";
import Record from "./screens/Record";
import Settings from "./screens/Settings";
import Verification from "./screens/Verification";
import ThemeContextProvider, { ThemeContext } from "./context/themeContext";

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

function MyTabs() {
  const { colors } = useContext(ThemeContext);
  const iconSize = 18;
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: Colors.primary400,
        },
        tabBarInactiveTintColor: "#9b9897",
        tabBarActiveTintColor: "white",
        tabBarIndicatorStyle: { backgroundColor: "white" },
        tabBarLabelStyle: {
          fontSize: 12,
          textTransform: "capitalize",
        },
        tabBarItemStyle: {
          flexDirection: "row",
          alignItems: "center",
        },
        tabBarIconStyle: {
          alignSelf: "center",
          borderWidth: 2,
          borderColor: "transparent",
        },
      }}
    >
      <Tab.Screen
        name="Report"
        component={Report}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="smartphone" size={iconSize} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Hotline"
        component={Hotline}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="phone-call" size={iconSize} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={Record}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="history" size={iconSize} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function MainAppScreen() {
  return (
    <MenuProvider>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: Colors.primary400 },
          headerTintColor: "white",
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen
          name="Home"
          component={MyTabs}
          options={{
            headerTitle: "Crime Reporting System",
            headerLeft: () => (
              <Image
                style={{ width: 40, height: 40, marginRight: 8 }}
                source={require("./assets/crs-logo_cropped.png")}
              />
            ),
            headerRight: () => <MenuBtn />,
          }}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{ animation: "fade_from_bottom" }}
        />
      </Stack.Navigator>
    </MenuProvider>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Register} />
      <Stack.Screen name="Verification" component={Verification} />
    </Stack.Navigator>
  );
}

function Root() {
  const { user } = useContext(AuthContext);
  const { mode } = useContext(ThemeContext);

  const screen = user ? (
    <>
      <StatusBar style="light" />
      <MainAppScreen />
    </>
  ) : (
    <>
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
      <AuthStack />
    </>
  );

  return screen;
}

export default function App() {
  return (
    <>
      <AuthContextProvider>
        <ThemeContextProvider>
          <NavigationContainer>
            <Root />
          </NavigationContainer>
        </ThemeContextProvider>
      </AuthContextProvider>
    </>
  );
}
