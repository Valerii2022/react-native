import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  ImageBackground,
  Text,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import Button from "../Button/Button";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import {
  add,
  authorized,
  remove,
  removeComment,
  removePost,
  unauthorized,
} from "../../../Redux/rootReducer";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../../config";

const RegistrationScreen = () => {
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passSecure, setPassSecure] = useState(true);
  const [focusLogin, setFocusLogin] = useState(false);
  const [focusEmail, setFocusEmail] = useState(false);
  const [focusPassword, setFocusPassword] = useState(false);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const registerDB = async ({ email, password }) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      updateUserProfile({ displayName: login });
      dispatch(add({ login, email, password }));
      dispatch(authorized());
      navigation.navigate("Home");
    } catch (error) {
      Alert.alert("Помилка реєстрації");
      navigation.navigate("Registration");
      throw error;
    }
  };

  async (onChange = () => {}) => {
    onAuthStateChanged((user) => {
      onChange(user);
    });
  };

  const updateUserProfile = async (update) => {
    const user = auth.currentUser;
    if (user) {
      try {
        console.log(auth.currentUser.displayName);
        await updateProfile(user, update);
      } catch (error) {
        throw error;
      }
    }
  };

  const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

  const signIn = () => {
    // if (login === "" || email === "" || password === "") {
    //   Alert.alert("Всі поля обов'язкові для заповнення!");
    //   return;
    // }
    // if (reg.test(email) === false) {
    //   Alert.alert("Невірний формат адреси електронної пошти!");
    //   return;
    // }
    // if (login.length < 6) {
    //   Alert.alert("Логін має бути довжиною мінімум 6 символів!!");
    //   return;
    // }
    // if (password.length < 6) {
    //   Alert.alert("Пароль має бути довжиною мінімум 6 символів!!");
    //   return;
    // }
    // console.log(
    //   `Логін - "${login}",адреса електронної пошти - "${email}", пароль - "${password}"`
    // );
    registerDB({ email, password });
    // dispatch(remove([]));
    // dispatch(removePost());
    // dispatch(unauthorized());
    // dispatch(removeComment());
    setLogin("");
    setEmail("");
    setPassword("");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        keyboardVerticalOffset={-142}
      >
        <ImageBackground
          source={require("../../../assets/images/BG.png")}
          resizeMode="cover"
          style={styles.image}
        >
          <View style={styles.registrationContainer}>
            <View style={styles.avatar}>
              <Image
                style={styles.addIcon}
                source={require("../../../assets/images/add.png")}
              />
            </View>
            <Text style={styles.title}>Реєстрація</Text>
            <TextInput
              onFocus={() => {
                setFocusLogin(true);
              }}
              onBlur={() => {
                setFocusLogin(false);
              }}
              value={login}
              onChangeText={setLogin}
              style={
                focusLogin
                  ? [styles.textInput, styles.focusedTextInput]
                  : styles.textInput
              }
              placeholder="Логін"
            ></TextInput>
            <TextInput
              onFocus={() => {
                setFocusEmail(true);
              }}
              onBlur={() => {
                setFocusEmail(false);
              }}
              value={email}
              onChangeText={setEmail}
              style={
                focusEmail
                  ? [styles.textInput, styles.focusedTextInput]
                  : styles.textInput
              }
              placeholder="Адреса електронної пошти"
            ></TextInput>
            <View>
              <TextInput
                onFocus={() => {
                  setFocusPassword(true);
                }}
                onBlur={() => {
                  setFocusPassword(false);
                }}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={passSecure}
                style={
                  focusPassword
                    ? [styles.textInput, styles.focusedTextInput]
                    : styles.textInput
                }
                placeholder="Пароль"
              ></TextInput>
              <Text
                style={styles.inputLink}
                onPress={() => {
                  setPassSecure(!passSecure);
                }}
              >
                {passSecure ? "Показати" : "Сховати"}
              </Text>
            </View>
            <View style={styles.btnWrap}>
              <Button title={"Увійти"} onPress={signIn} />
            </View>
            <Text style={styles.text}>
              Вже є акаунт?
              <Text
                style={styles.textLink}
                onPress={() => navigation.navigate("Login")}
              >
                {" "}
                Увійти
              </Text>
            </Text>
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  avatar: {
    width: 120,
    height: 120,
    backgroundColor: "#f6f6f6",
    borderRadius: 16,
    position: "absolute",
    top: -60,
    left: "50%",
    transform: [{ translateX: -50 }],
  },
  addIcon: {
    position: "absolute",
    bottom: 14,
    right: -12,
  },
  registrationContainer: {
    width: "100%",
    height: 515,
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 92,
    paddingLeft: 16,
    paddingRight: 16,
    marginTop: "auto",
    marginBottom: 0,
  },
  title: {
    fontFamily: "Roboto",
    fontWeight: 500,
    fontSize: 30,
    lineHeight: 35,
    marginBottom: 32,
    marginLeft: "auto",
    marginRight: "auto",
    letterSpacing: 0.01,
    color: "#212121",
  },
  textInput: {
    width: "100%",
    height: 50,
    backgroundColor: "#f6f6f6",
    color: "#bdbdbd",
    fontFamily: "Roboto",
    fontSize: 16,
    lineHeight: 18.75,
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  focusedTextInput: {
    backgroundColor: "#fff",
    borderColor: "#ff6c00",
    borderWidth: 1,
  },
  text: {
    color: "#1B4371",
    fontFamily: "Roboto",
    fontSize: 16,
    lineHeight: 18.75,
    textAlign: "center",
  },
  textLink: {
    textDecorationLine: "underline",
  },
  inputLink: {
    padding: 10,
    position: "absolute",
    right: 6,
    top: 6,
    color: "#1B4371",
    fontFamily: "Roboto",
    fontSize: 16,
    lineHeight: 18.75,
    textAlign: "center",
  },
  btnWrap: {
    marginTop: 27,
    marginBottom: 16,
    height: 50,
  },
});

export default RegistrationScreen;