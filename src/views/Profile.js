import { Button, Spacer, Text } from "@nextui-org/react";
import { useAuth } from "../auth/authContext"
import Nav from "../components/navbar/Nav";
import { useState } from "react";
import { Box, Center, Tab, TabList, TabPanel, TabPanels, Tabs, useColorModeValue } from "@chakra-ui/react";
import Information from "../components/profile/Information";
import Anuncios from "../components/profile/Anuncios";
import Favoritos from "../components/profile/Favoritos";
import Footer from "../components/footer/Footer";

export default function Profile(){
  const auth=useAuth();
    const currentUser=auth.user;
    

    
    const colors = useColorModeValue(
      ['grey.50', 'grey.50', 'grey.50'],
      ['grey.900', 'grey.900', 'grey.900'],
    )
    const [tabIndex, setTabIndex] = useState(0)
    const bg = colors[tabIndex]
    

    return(
        <div>
          <Box display="flex" flexDirection="column" minHeight="100vh">
            <Nav/>
            <Center>
          {currentUser && <Text h2 weight={"bold"}>¡Hey, {currentUser.username}!</Text>} </Center>
        

           
      
    <Center>

    <Tabs onChange={(index) => setTabIndex(index)} bg={bg}>
      <TabList>
        <Tab>Mis datos de perfil</Tab>
        <Tab>Mis favoritos</Tab>

        <Tab>Anuncios que has publicado</Tab>
      
      </TabList>
      <TabPanels p='2rem'>
        <TabPanel><Information/></TabPanel>
        <TabPanel><Favoritos/></TabPanel>
        <TabPanel><Anuncios/></TabPanel>
        
      </TabPanels>
    </Tabs>
    </Center>
    <Spacer y={4}/>
      <Footer/>
      </Box>
        </div>

    )
}