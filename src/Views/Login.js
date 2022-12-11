import { createContext, useState } from "react";
import { Button, ButtonGroup, Heading, Text, VStack } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useNavigate } from "react-router";
import TextField from "../components/TextField";
import theme from "../components/theme";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import Toggle from "../components/Toggle";

import Header from "../components/Header";
import Footer from "../components/Footer";
import useApplicationData from "../hooks/useApplicationData";
import axios from "axios";

export const LoginContext = createContext();

export default function Login() {
  const [error, setError] = useState();
  const [user, setUser] = useState({});
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
              .post("/api/auth/login", {
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
                if (!res || !res.ok) {
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
            w={{ base: "80%", md: "500px" }}
            m="auto"
            justify="center"
            h="90vh"
            spacing="1rem"
          >
            <Heading>log in</Heading>
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
                log in
              </Button>
            </ButtonGroup>
          </VStack>
        </Formik>
        <Footer />
      </ChakraProvider>
    </>
  );
}
