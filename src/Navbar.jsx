import React, { useContext } from "react";
import { Flex, Box, Text, Link, Stack, ChakraProvider, Button } from "@chakra-ui/react";
import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import {Link as RLink} from 'react-router-dom'
import { Appstate } from "./App";
const MenuItem = ({ children, isLast, to = "/", ...rest }) => {
  return (
    <Link href={to}>
      <Text display="block" {...rest}>
        {children}
      </Text>
    </Link>
  );
};
function Logo(props) {
  return (
    <Box {...props}>
      <Text color={'black'} fontSize="lg" fontWeight="bold">
        Weather App
      </Text>
    </Box>
  )
}
const MenuToggle = ({ toggle, isOpen }) => {
  return (
    <Box display={{ base: "block", md: "none" }} onClick={toggle}>
      {isOpen ? <CloseIcon /> : <HamburgerIcon />}
    </Box>
  );
};

const MenuLinks = ({ isOpen }) => {
    const {Logout,login} = useContext(Appstate);
    function logout(){
        Logout();
    }
  return (
    <Box
      display={{ base: isOpen ? "block" : "none", md: "block" }}
      flexBasis={{ base: "100%", md: "auto" }}
    >
      <Stack
        spacing={4}
        align="center"
        justify={["center", "space-between", "flex-end", "flex-end"]}
        direction={["column", "row", "row", "row"]}
        pt={[2, 2, 0, 0]}
      >
        <MenuItem to="/">Home</MenuItem>
        <MenuItem to="/table">Users</MenuItem>
        <MenuItem ><RLink to={'weather'}>Weather</RLink></MenuItem>
        {/* <MenuItem to="/how">How It Works</MenuItem> */}
        {login?(<Button colorScheme="teal" onClick={logout}>Logout</Button>):(<>
        <Button colorScheme="teal"> <RLink to={'login'}>Login</RLink> </Button>
        <Button colorScheme="teal"><RLink to={'register'}>Create Account</RLink> </Button></>)}
        {/* Add more menu items as needed */}
        {login && console.log("Inside ",login)}
      </Stack>
    </Box>
  );
};

const NavBarContainer = ({ children, ...props }) => {
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      w="100%"
      mb={0}
      px={10}
      h={'10vh'}
      bg={["primary.500", "primary.500", "white", "white"]}
      color={["white", "white", "black", "black"]}
      {...props}
    >
      {children}
    </Flex>
  );
};

const NavBar = (props) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <ChakraProvider>
       <NavBarContainer {...props}>
      <Logo
        w="100px"
        color={["white", "white", "primary.500", "primary.500"]}
      />
      <MenuToggle toggle={toggle} isOpen={isOpen} />
      <MenuLinks isOpen={isOpen} />
    </NavBarContainer>
    </ChakraProvider>
  );
};

export default NavBar;
