
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
import { Searchbar } from "../components/search/Searchbar.js";

export default function Home(){
    

    return(
        <div>
            <Nav/>
            <Flex minH="100vh" flexDirection="column" justifyContent="space-between">
            <Center id="mobile">
            <Spacer y={1}/>
            <Searchbar id="searchbar" />
            <Spacer y={1}/>
            </Center>
           <CarouselP/>
           <Spacer y={2}/>
           <Center>
           <div id="text">
          <br/>
           <Text size={30} id="madrid" weight={"bold"} >Habitaciones en Madrid</Text> <Spacer x={13}/>
          </div>


          
           <Center id="mobile">
            <Text size={30} id="madrid" weight={"bold"} >Habitaciones en Madrid</Text> <Spacer x={13}/>
            </Center>
            <div class="espacio">
            <Spacer x={14}/>
            </div>

            <div id="vermas">
            
            <Link to={`/results/Madrid`}><Button  style={{ backgroundColor: '#2fabe5'}} auto>Ver más</Button></Link>
            </div>
            </Center>
            <Spacer y={0.3}/>

          <Slide triggerOnce>
            <RoomsMadrid />
            </Slide>

            <div id="mobile">
              <Center>
            <Link to={`/results/Madrid`}><Button  style={{ backgroundColor: '#2fabe5'}} auto>Ver más</Button></Link>
            </Center>
            </div>
          

            <Spacer y={3}/>
      <Center>
        <div id="text">
        <br/>
      <Text size={30} id="barcelona" weight={"bold"} >Habitaciones en Barcelona</Text><Spacer x={13}/>
      </div>
      <Center id="mobile">

              <Text size={30} id="barcelona" weight={"bold"} >Habitaciones en Barcelona</Text>

              </Center>
              <div class="espacio">
            <Spacer x={14}/>
            </div>


              <div id="vermas">

              <Link to={`/results/Barcelona`}><Button style={{ backgroundColor: '#2fabe5'}} auto>Ver más </Button></Link>
              </div>

              </Center>
              <Spacer y={0.3}/>
              <Slide triggerOnce>
              <RoomsBarcelona/></Slide>
              <div id="mobile">
              <Center>
              <Link to={`/results/Barcelona`}><Button style={{ backgroundColor: '#2fabe5'}} auto>Ver más </Button></Link>
              </Center>
              </div>
              <Spacer y={3}/>
              <Center>

              
              <Text size={30} id="ciudades "weight={"bold"} >Ciudades mas buscadas</Text>
              </Center>
              <Spacer y={0.2}/>
<CityCards/>

<Spacer y={6}/>
<div id="Footer">
            <Footer/>
            </div>
            
            </Flex>
 
            </div>
            
          
            
            )
        
        
        
        }