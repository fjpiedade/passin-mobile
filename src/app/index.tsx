import { useState } from "react";

import { View, Text, Image, StatusBar, Alert } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Link, Redirect } from "expo-router";

import { colors } from "@/styles/colors";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import React from "react";

import { api } from "@/server/api";

import { useBadgeStore } from "@/store/badge-store";

export default function Home() {
  // return (
  //   <View style={styles.container}>
  //     <Text style={styles.title}>Pass.In Application</Text>
  //   </View>
  // );

  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const badgeStore = useBadgeStore();

  async function handleAccessCredential() {
    // (value) => setCode(value)

    try {
      if (!code.trim()) {
        return Alert.alert(
          "Credential",
          "Please enter with your Ticket Number"
        );
      }
      //console.warn(code);
      setIsLoading(true);

      const { data } = await api.get(`/attendees/${code}/badge`);
      setIsLoading(false);
      badgeStore.save(data.badge);
      // console.log(badgeStore.data);
    } catch (error) {
      setIsLoading(false);
      //console.warn(error);
      Alert.alert("Credential", "Credential not founded!");
    }
  }

  if (badgeStore.data?.checkInURL) {
    return <Redirect href="/ticket" />;
  }
  return (
    <View className="flex-1 bg-green-500 items-center justify-center p-8">
      {/* <Text className="text-white text-2xl font-bold">Pass.In App</Text> */}
      <StatusBar barStyle="light-content" />
      <Image
        source={require("@/assets/logo.png")}
        className="h-16"
        resizeMode="contain"
      />
      <View className="w-full mt-12 gap-3">
        <Input>
          <MaterialCommunityIcons
            name="ticket-confirmation-outline"
            color={colors.green[200]}
            size={20}
          />
          <Input.Field
            placeholder="Ticket Number"
            onChangeText={setCode}
          ></Input.Field>
        </Input>
        <Button
          title="Access your Credentials"
          // onPress={() => console.log("Click!")}
          onPress={handleAccessCredential}
          isLoading={isLoading}
        />

        <Link
          href="/register"
          className="text-gray-100 text-base font-bold text-center mt-8"
        >
          Buy your Ticket Here!
        </Link>
      </View>
    </View>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: "red",
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   title: {
//     color: "white",
//     fontSize: 30,
//     fontWeight: "900",
//   },
// });
