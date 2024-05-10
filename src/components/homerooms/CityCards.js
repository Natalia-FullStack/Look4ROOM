import { Center, Spacer } from "@chakra-ui/react";
import { Card, Col, Row, Button, Text, Container } from "@nextui-org/react";
import { Link } from "react-router-dom";

export const CityCards = () => {
const listaCiudades = [
  {  
    link : "/results/Sevilla",
  nombre: "Sevilla",
  imagen: "https://img.freepik.com/fotos-premium/plaza-espana-sevilla-espana-gran-ejemplo-arquitectura-renacentista-iberica-dia-verano-cielo-azul_521059-1557.jpg?size=626&ext=jpg&ga=GA1.1.672697106.1714780800&semt=sph",
  },
  {
    link : "/results/Valencia",
    nombre: "Valencia",
    imagen: "https://img.freepik.com/foto-gratis/edificios-modernos_1127-3313.jpg?size=626&ext=jpg&ga=GA1.1.87170709.1706313600&semt=ais",
  },
  {
    link : "/results/Salamanca",
    nombre: "Salamanca",

    imagen: "https://img.freepik.com/fotos-premium/catedral-salamanca-es-catedral-estilo-gotico-tardio-barroco-ciudad-salamanca-castilla-leon-espana_78361-5641.jpg",
  },
];


  return (
    <>
    <Container xl 
        display="flex"
        direction="row"
        alignItems="center"
        justify="center"
        >
    
    {listaCiudades.map((ciudad, index) => (
    
    <div key={index}>

  <Link to={ciudad.link}>

    
    <Card isHoverable isPressable  id="roomCard" style={{
      width: "290px",
      margin: "25px", // Agrega un margen de 10px alrededor de cada tarjeta
    }}
    >
        <Card.Image
                src={ciudad.imagen}
                    objectFit="cover"
                    width="100%"
                />
          <Card.Header>
            <Text h3 b>{ciudad.nombre}</Text>
          </Card.Header>
          
        
        </Card>
        </Link>

        </div>
         ))}
  </Container>

    
   

  </>
)
  };