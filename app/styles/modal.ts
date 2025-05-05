import { StyleSheet } from "react-native";

const modalStyles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    searchBar: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
      marginVertical: 10,
      paddingHorizontal: 10,
    },
    modalContainer: {
      backgroundColor: "white",
      width: 300,
      borderRadius: 10,
      padding: 20,
    },
    deleteButton: {
      backgroundColor: 'red',
      borderRadius: 15,
      padding: 10,
      marginLeft: 'auto',
    },
    deleteButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
  });

  export default modalStyles;