import { useState } from "react";
import { Button, ButtonGroup, Heading, Text, VStack } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useNavigate } from "react-router";
import TextField from "../components/TextField";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import theme from "../components/theme";
import Toggle from "../components/Toggle";

import useApplicationData from "../hooks/useApplicationData";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";

const SignUp = () => {
  const [user, setUser] = useState({});
  const { error, setError } = useApplicationData();
  const state = useApplicationData();

  const navigate = useNavigate();

  return (
    <>
      <Header />
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Toggle />
        <Formik
          initialValues={{ username: "", password: "" }}
          onSubmit={(values, actions) => {
            const vals = { ...values };
            actions.resetForm();
            axios
              .post("api/auth/signup", {
                method: "POST",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(vals),
              })
              .catch((err) => {
                return;
              })
              .then((res) => {
                if (!res || !res.ok || res.status >= 400) {
                  return;
                }
                return res.json();
              })
              .then((data) => {
                if (!data) return;
                if (data.status) {
                  setError(data.status);
                } else if (data.loggedIn) {
                  localStorage.setItem("teeboUser", data.userId);
                  setUser({ ...data });
                  state.setState((prev) => ({ ...prev, loggedIn: true }));
                  localStorage.setItem("teeboUser", data.userId);
                  navigate("/");
                }
              });
          }}
        >
          <VStack
            as={Form}
            w={{ base: "90%", md: "500px" }}
            m="auto"
            justify="center"
            h="90vh"
            spacing="1rem"
          >
            <Heading>sign up</Heading>
            <Text as="p" color="red.500">
              {error}
            </Text>
            <TextField
              name="username"
              placeholder="Enter username"
              autoComplete="off"
              label="username"
            />

            <TextField
              name="password"
              placeholder="Enter password"
              autoComplete="off"
              label="password"
              type="password"
            />

            <ButtonGroup pt="1rem">
              <Button colorScheme="orange" type="submit">
                create account
              </Button>
            </ButtonGroup>
          </VStack>
        </Formik>
      </ChakraProvider>
      <Footer />
    </>
  );
};

export default SignUp;
