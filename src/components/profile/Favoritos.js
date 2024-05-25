import { useEffect, useState } from "react";
import { useAuth } from "../../auth/authContext";
import { collection, deleteDoc, getDocs, query, where, writeBatch } from "firebase/firestore";
import { db } from "../../firebase.config";
import { Button, Card, Loading, Row, Spacer, Text } from "@nextui-org/react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { Flex } from "@chakra-ui/react";
import Footer from "../footer/Footer";

export default function Favoritos(){
  const {user} = useAuth();
  const useruid = user ? user.uid : null;


    const [habitaciones, setHabitaciones] = useState([]);
    const [loading, setLoading] =useState(false);
  
    
  
   

      useEffect(() => {
        const getHabitaciones = async () => {
          setLoading(true);
      
          if (useruid) { // Comprobar si el usuario está autenticado
            const datos=await getDocs(query(collection(db, 'favoritos'),where ('usuarioUID', '==', useruid)));

      
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
      

      const eliminar = async (habitacion) => {
        try {
          const querySnapshot = await getDocs(
            query(collection(db, 'favoritos'), where("idHabitacion", "==", habitacion.idHabitacion))
          );
      
          const batch = writeBatch(db);
      
          querySnapshot.forEach((doc) => {
            batch.delete(doc.ref);
          });
      
          await batch.commit();
      
          toast.success("¡Has eliminado esta habitación de tu lista de favoritos!");
      
          const nuevasHabitaciones = habitaciones.filter((h) => h.idHabitacion !== habitacion.idHabitacion);
          setHabitaciones(nuevasHabitaciones);
        } catch (error) {
          toast.error(error.message);
        }
      };
      
      
if (!habitaciones.length) {
  return (
    <div>
      <Text h2 >Tu lista está vacía</Text>
    
      
    </div>
  );
  }
  

 
  return (
    <div>
                 

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
        
       
          <Button auto color="error" onPress={()=>eliminar(habitacion)} >
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

   </div>
)
}
