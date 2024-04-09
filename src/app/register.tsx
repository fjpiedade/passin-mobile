import { useState } from "react";
import React from "react";
import { View, Text, Image, StatusBar, Alert } from "react-native";
import {
  MaterialCommunityIcons,
  FontAwesome6,
  MaterialIcons,
} from "@expo/vector-icons";

import { Link, router } from "expo-router";

import { colors } from "@/styles/colors";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import axios from "axios";

import { api } from "@/server/api";
import { useBadgeStore } from "@/store/badge-store";

const EVENT_ID = "9e9bd979-9d10-4915-b339-3786b1634f33";

export default function Register() {
  // return (
  //   <View style={styles.container}>
  //     <Text style={styles.title}>Pass.In Application</Text>
  //   </View>
  // );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const badgeStore = useBadgeStore();

  async function handleRegister() {
    // (value) => setCode(value)
    // 9e9bd979-9d10-4915-b339-3786b1634f33
    try {
      if (!name.trim() || !email.trim()) {
        return Alert.alert("Register", "Fill all the fields are required!");
      }
      setIsLoading(true);
      const registerResponse = await api.post(`/events/${EVENT_ID}/attendees`, {
        name,
        email,
      });

      if (registerResponse.data.attendeeId) {
        const badgeResponse = await api.get(
          `/attendees/${registerResponse.data.attendeeId}/badge`
        );

        badgeStore.save(badgeResponse.data.badge);

        Alert.alert("Register", "Register Successfully!", [
          { text: "OK", onPress: () => router.push("/ticket") },
        ]);
      }
      // console.warn(name + " " + email);
      // router.push("/ticket");
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      if (axios.isAxiosError(error)) {
        if (
          String(error.response?.data.message).includes("already registered")
        ) {
          return Alert.alert(
            "Register",
            "This e-mail is already registered for this event."
          );
        }
      }

      Alert.alert("Register", "Register failed");
    }
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
          <FontAwesome6
            name="user-circle"
            color={colors.green[200]}
            size={20}
          />
          <Input.Field
            placeholder="Full Name"
            onChangeText={setName}
          ></Input.Field>
        </Input>

        <Input>
          <MaterialIcons
            name="alternate-email"
            color={colors.green[200]}
            size={20}
          />
          <Input.Field
            placeholder="E-mail"
            keyboardType="email-address"
            onChangeText={setEmail}
          ></Input.Field>
        </Input>

        <Button
          title="Register to Receive your Ticket"
          // onPress={() => console.log("Click!")}
          onPress={handleRegister}
          isLoading={isLoading}
        />

        <Link
          href="/"
          className="text-gray-100 text-base font-bold text-center mt-8"
        >
          Check you Ticket!
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
