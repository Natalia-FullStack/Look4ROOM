import { useEffect, useState } from "react";
import { db } from "../firebase.config";
import { collection, getDocs, or, query, where } from "firebase/firestore";
import { Link, useParams } from "react-router-dom";
import Nav from "../components/navbar/Nav";
import { Button, Card, Container, Input, Loading, Row, Spacer, Text } from "@nextui-org/react";
import { Box, Center, Select } from "@chakra-ui/react";
import { toast } from "react-hot-toast";
import Footer from "../components/footer/Footer";
import { useAuth } from "../auth/authContext"

export const Resultados = () => {
  const auth = useAuth();

  const {searchTerm}=useParams();
 

const [habitaciones, setHabitaciones] = useState([]);
const [loading, setLoading] = useState(false);
const [numero, setNumero]=useState("");
const [tipo, setTipo]=useState("");



function normalizeString(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

useEffect(() => {
  const getHabitaciones = async () => {
    setLoading(true);

  
    const datos = await getDocs(collection(db, "habitaciones"));
    const habitaciones = datos.docs
    .map((doc) => doc.data())
    .filter((habitacion) =>
      normalizeString(habitacion.direccion.ciudad).includes(normalizeString(searchTerm))
    );
   
    


    setHabitaciones(habitaciones);
    setLoading(false);
  }

  getHabitaciones();
}, [normalizeString(searchTerm)]);


const filtrarPrecio = async () => {
  try {
    setLoading(true);
    toast.success("Filtrado correctamente");

    let habitacionesQuery = collection(db, 'habitaciones');
    habitacionesQuery = query(habitacionesQuery, where('direccion.ciudad', '==', searchTerm.toLowerCase()));

  
    habitacionesQuery = query(habitacionesQuery);

    if (numero) {
      habitacionesQuery = query(habitacionesQuery, where('precio', '<=', numero));
    }

    if (tipo) {
      habitacionesQuery = query(habitacionesQuery, where('tipoHabitacion', '==', tipo));
    }

    const datos = await getDocs(habitacionesQuery);

    console.log(datos.docs.map(doc => doc.data()));

    const habitaciones = [];

    datos.docs.forEach((doc) => {
      habitaciones.push(doc.data());
    });

    setHabitaciones(habitaciones);

    setLoading(false);
  } catch (error) {
    toast.error("No hay resultados para ese precio");
  }
};



if (loading) {
  return <><Nav/><Center><Spacer y={2}/><Loading /></Center></>;
}
if(!habitaciones.length){
  return (
    <>
      <Nav />
      <Center>
        <Text h1 color="warning">Ups...</Text>
      </Center>
      <Center>
        <Text h2>No se han encontrado resultados para "{searchTerm}"</Text>
      </Center>
      <Center>
        <Text h3>Prueba con otra búsqueda</Text>
      </Center>
      <Spacer y={16} />
      <Footer />
    </>
  );
}  

  
    return (
      <div>
            <Box display="flex" flexDirection="column" minHeight="100vh">

      <Nav/>
      <Center>
      <Text h2>Habitaciones para alquilar en {searchTerm} ({habitaciones.length})</Text>
    
      </Center>
      <Spacer y={1}/>
      <Center>
      <Text h4>Precio máximo:</Text><Spacer x={0.3}/> <Input width="100px" type="number" bordered onChange={(e)=>setNumero(e.target.value)}/>  <Spacer x={1}/>
      <Text h4>Tipo de habitación:</Text> <Select width="150px"  placeholder="Selecciona" value={tipo} onChange={(e)=>setTipo(e.target.value)}><option value="Compartida">Compartida</option><option value="Individual">Individual</option></Select>
      <Spacer x={1}/>
      <Button auto onPress={filtrarPrecio} color="primary">Filtrar</Button>    
      
      </Center>

      <Spacer y={1}/>

      <Spacer y={1}/>
      {loading ? <Container display="flex" justify="center"><Loading size="lg"/></Container> : 
      <ul>
        <Container xl 
        display="inline-flex"
        alignItems="center"
        justify="flex-start"
        >
     {habitaciones.map((habitacion, index)=> (
        <>
        <Link to={`/habitacion/${habitacion.idHabitacion}`}><Card isHoverable isPressable key={index}  id="roomCard" css={{w:"290px"}}>
        <Card.Image
                src={`${habitacion.imagenes[0]}`}
                    objectFit="cover"
                    width="100%"
                />
          <Card.Header>
            <Text b>Habitación {habitacion.tipoHabitacion}</Text>
          </Card.Header>
          <Card.Divider />
          <Card.Body css={{ py: "$10" }}>
            <Text h3>
              {habitacion.precio}€/mes
            </Text>
            <Text>
              {habitacion.direccion.calle}, {habitacion.direccion.numero} ({habitacion.direccion.ciudad.charAt(0).toUpperCase()+ habitacion.direccion.ciudad.slice(1)})
            </Text>
          </Card.Body>
          <Card.Divider />
        
        </Card>
        

        </Link>
        <Spacer x={2}/>
        </>
      ))}
              

      </Container>
      

    </ul>
 
      }
      <Spacer y={6}/>
      <Footer/>
      </Box>
    </div>
    );
  };