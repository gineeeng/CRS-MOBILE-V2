import { MaterialIcons } from "@expo/vector-icons";
import { useContext } from "react";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { AuthContext } from "../../context/authContext";
import { Colors } from "../../constants/Colors";
import { Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function MenuBtn() {
  const { logout } = useContext(AuthContext);
  const navigation = useNavigation();

  return (
    <Menu>
      <MenuTrigger
        children={<MaterialIcons name="more-vert" size={24} color="white" />}
        customStyles={{ triggerOuterWrapper: { marginRight: 5 } }}
      />
      <MenuOptions
        customStyles={{
          optionText: { color: Colors.primary400 },
        }}
      >
        <MenuOption
          onSelect={() => navigation.navigate("Settings")}
          children={
            <View
              style={{ flexDirection: "row", gap: 6, alignItems: "center" }}
            >
              <MaterialIcons
                name="settings"
                size={24}
                color={Colors.primary400}
              />
              <Text style={{ color: Colors.primary400 }}>Settings</Text>
            </View>
          }
        />
        <MenuOption
          onSelect={logout}
          children={
            <View
              style={{ flexDirection: "row", gap: 6, alignItems: "center" }}
            >
              <MaterialIcons
                name="logout"
                size={24}
                color={Colors.primary400}
              />
              <Text style={{ color: Colors.primary400 }}>Logout</Text>
            </View>
          }
        />
      </MenuOptions>
    </Menu>
  );
}
