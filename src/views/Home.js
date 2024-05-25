
import Nav from "../components/navbar/Nav";
import Carousel from "../components/carousel/CarouselP";
import { Button, Card, Col, Spacer, Text } from "@nextui-org/react";
import {
  Center,

 
  Flex,
} from '@chakra-ui/react';
import RoomsMadrid from "../components/homerooms/RoomsMadrid";
import RoomsBarcelona from "../components/homerooms/RoomsBarcelona";
import Footer from "../components/footer/Footer";
import CarouselP from "../components/carousel/CarouselP";
import { Slide } from "react-awesome-reveal";
import { Link } from "react-router-dom";
import { Row } from "react-day-picker";
import { CityCards } from "../components/homerooms/CityCards";
import "./css/Home.css";
export default function Home(){
    

    return(
        <div>
            <Nav/>
            <Flex minH="100vh" flexDirection="column" justifyContent="space-between">
 
           <CarouselP/>
           <Spacer y={2}/>
           <Center>
            
            <Text size={30} id="madrid" weight={"bold"} >Habitación en Madrid</Text> <Spacer x={13}/>
            <div id="vermas">
            
            <Link to={`/results/Madrid`}><Button  style={{ backgroundColor: '#2fabe5'}} auto>Ver más</Button></Link>
            </div>
            </Center>
            <Spacer y={0.3}/>

          <Slide triggerOnce>
            <RoomsMadrid />
            </Slide>
            <Spacer y={3}/>
      <Center>
              <Text size={30} id="barcelona" weight={"bold"} >Habitación en Barcelona</Text><Spacer x={13}/>
              <div id="vermas">

              <Link to={`/results/Barcelona`}><Button style={{ backgroundColor: '#2fabe5'}} auto>Ver más </Button></Link>
              </div>

              </Center>
              <Spacer y={0.3}/>
              <Slide triggerOnce>
              <RoomsBarcelona/></Slide>

              <Spacer y={3}/>
              <Center>

              
              <Text size={30} id="ciudades "weight={"bold"} >Ciudades mas buscadas</Text>
              </Center>
              <Spacer y={0.2}/>
<CityCards/>

<Spacer y={3 }/>
<div id="Footer">
            <Footer/>
            </div>
            
            </Flex>
 
            </div>
            
          
            
            )
        
        
        
        }