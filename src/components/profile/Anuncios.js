import { collection, deleteDoc, doc, getDocs, orderBy, query, where, writeBatch } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../auth/authContext";
import { db } from "../../firebase.config";
import { Button, Card, Loading, Row, Spacer, Text } from "@nextui-org/react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { Center, Flex } from "@chakra-ui/react";


export default function Anuncios() {
    const [habitaciones, setHabitaciones] = useState([]);
    const [loading, setLoading] =useState(false);
    const [eliminado, setEliminado] = useState(false);

    const {user} = useAuth();
    const useruid = user ? user.uid : null;


    useEffect(() => {
      const getHabitaciones = async () => {
        setLoading(true);
    
        if (useruid) { // Comprobar si el usuario está autenticado
          const datos = await getDocs(
            query(collection(db, 'habitaciones'), where('idVendedor', '==', useruid))
          );
    
          const habitaciones = [];
    
          datos.forEach((habitacion) => {
            habitaciones.push(habitacion.data());
          });
    
          setHabitaciones(habitaciones);
        }
    
        setLoading(false);
      };
    
      getHabitaciones();
    }, [useruid]);
    
    const eliminarFavorito = useCallback(async (habitacion) => {
      try {
        const habitacionesQuerySnapshot = await getDocs(
          query(collection(db, 'habitaciones'), where("idHabitacion", "==", habitacion.idHabitacion))
        );
        const habitacionesBatch = writeBatch(db);
        habitacionesQuerySnapshot.forEach((doc) => {
          habitacionesBatch.delete(doc.ref);
        });
        await habitacionesBatch.commit();
    
        const favoritosQuerySnapshot = await getDocs(
          query(collection(db, 'favoritos'), where("idHabitacion", "==", habitacion.idHabitacion))
        );
        const favoritosBatch = writeBatch(db);
        favoritosQuerySnapshot.forEach((doc) => {
          favoritosBatch.delete(doc.ref);
        });
        await favoritosBatch.commit();
    
        toast.success("Tu anuncio ha sido eliminado con éxito");
    
        const nuevasHabitaciones = habitaciones.filter((h) => h.idHabitacion !== habitacion.idHabitacion);
        setHabitaciones(nuevasHabitaciones);
      } catch (error) {
        toast.error(error.message);
      }
    });
    
    

if (!habitaciones.length) {
return (
  <div>
    <Text h2 >Ningún anuncio publicado</Text>
    <Spacer y={1} />

    <Link to="/publicar"><Button auto color="success">¡Publica un anuncio!</Button></Link>
    
  </div>
);
}






    return (
        <div>
                     <Flex minH="100vh" flexDirection="column" justifyContent="space-between">

            {loading ? <Loading/> :
        <>
        {habitaciones.slice().reverse().map((habitacion, index) => (
          <>
        <Card css={{ mw: "120rem" }} key={index}>
          <Card.Header>
            <Text b>Habitación {habitacion.tipoHabitacion}</Text>
          </Card.Header>
          <Card.Divider />
          <Card.Body css={{ py: "$10" }}>
          <Text>
  {habitacion.direccion.calle}, {habitacion.direccion.numero} (
  {habitacion.direccion.ciudad
    ? habitacion.direccion.ciudad.charAt(0).toUpperCase() +
      habitacion.direccion.ciudad.slice(1)
    : ''})
  <Spacer y={1} />
  <b>{habitacion.precio}€/mes</b>
</Text>

          </Card.Body>
          <Card.Divider />
          <Card.Footer>
            <Row justify="flex-start">
            <Link to={`/edit/${habitacion.idHabitacion}`}><Button auto color="success">Editar</Button></Link>
              <Spacer x={0.5} />
              <Button auto color="error" onPress={()=>eliminarFavorito(habitacion)} >
                Eliminar
              </Button>
              </Row>
              
              <Spacer x={0.5} />
              <Link to={`/habitacion/${habitacion.idHabitacion}`}><Button auto>Ver más</Button></Link>
            
          </Card.Footer>
        </Card>
        <Spacer y={1}/>
       </>
       ))  }
       
       </>}
       </Flex>
       </div>
    )
}
