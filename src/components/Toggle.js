import { Button } from "@chakra-ui/button";
import { useColorMode } from "@chakra-ui/color-mode";
import { useEffect } from "react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

const Toggle = () => {
  const { colorMode, toggleColorMode } = useColorMode("dark");

  useEffect(() => {
    if (colorMode === "dark") return;
    toggleColorMode();
  }, [colorMode]);

  return (
    <Button
      onClick={() => toggleColorMode()}
      pos="absolute"
      bottom="0"
      right="0"
      m="2.5rem"
      display="none"
    >
      {colorMode === "dark" ? (
        <SunIcon color="orange.200" />
      ) : (
        <MoonIcon color="blue.700" />
      )}
    </Button>
  );
};

export default Toggle;
