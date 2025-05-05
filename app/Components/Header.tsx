import React, { useState } from "react";
import { View, Modal, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Appbar } from "react-native-paper";
import { useRouter } from "expo-router";

interface HeaderProps {
  title: string;
  onMenuPress?: () => void;
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, onMenuPress, children }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title={title} />
        <Appbar.Action icon="menu" onPress={() => { setMenuVisible(true); if (onMenuPress) onMenuPress(); }} />
      </Appbar.Header>

      {/* Menu Modal */}
      <Modal
        transparent
        visible={menuVisible}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            {children}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuContainer: {
    backgroundColor: "white",
    width: 200,
    borderRadius: 10,
    padding: 10,
  },
  menuItem: {
    paddingVertical: 12,
  },
  menuText: {
    fontSize: 16,
  },
});

export default Header;
