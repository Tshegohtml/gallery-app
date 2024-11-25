import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [gallery, setGallery] = useState([]);

  const loadGallery = async () => {
    try {
      const storedImages = await AsyncStorage.getItem("gallery");
      if (storedImages) {
        setGallery(JSON.parse(storedImages));
      }
    } catch (error) {
      console.error("Failed to load images from storage", error);
    }
  };

  const saveGallery = async (images) => {
    try {
      await AsyncStorage.setItem("gallery", JSON.stringify(images));
    } catch (error) {
      console.error("Failed to save images to storage", error);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "Camera access is required.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync();
    if (!result.canceled) {
      const newGallery = [...gallery, result.uri];
      setGallery(newGallery);
      saveGallery(newGallery);
    }
  };

  const handleUploadPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "Media library access is required.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.canceled) {
      const newGallery = [...gallery, result.uri];
      setGallery(newGallery);
      saveGallery(newGallery);
    }
  };

  const renderItem = ({ item }) => (
    <Image source={{ uri: item }} style={styles.image} />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MY GALLERY APP</Text>
      <FlatList
        data={gallery}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3}
        contentContainerStyle={styles.galleryContainer}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleUploadPhoto}>
          <Text style={styles.buttonText}>Upload Photo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#000000", // Changed to black
    textAlign: "center",
    marginVertical: 20,
  },
  galleryContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  image: {
    width: 100,
    height: 100,
    margin: 8,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#F5A623",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#87CEEB", // Changed to sky blue
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 10,
    minWidth: "40%",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
