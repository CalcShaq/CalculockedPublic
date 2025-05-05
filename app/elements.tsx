import { TextInput, Button, View, Alert, Text} from 'react-native';


export async function handleStorage(userId,passwordInput,userInput,titleInput) {
  try {
    await Storage.storePassword(userId, passwordInput)
    await Storage.storeUsername(userId, userInput)
    await Storage.storeTitle(userId, titleInput)
  }
  catch {
    Alert.alert("error")
  };
};
export async function handleProfile(userId) {
  try {
    await Storage.retrievePassword(userId)
    return
  }
  catch {
    Alert.alert("error")
  }
}
  


      //Read from api function (/data) not implemented yet
      //<View>
        //<Text> Your Profiles:</Text>
        //{data.profiles.map((profile) => (
          //<Text  key={profile.id}> Website: {profile.title} Username: {profile.username} Password: {profile.password}</Text>
        //))}
      //</View>