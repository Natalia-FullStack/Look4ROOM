import { Card, Row, Text, Button, Container, Loading, Spacer } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../../firebase.config";
import { Center } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import './css/Rooms.css';


export default function RoomsMadrid(){
    const [habitaciones, setHabitaciones] = useState([]);
    const [loading, setLoading] =useState(false);


    useEffect(()=>{
        const getHabitaciones=async()=>{
          setLoading(true)
         const datos=await getDocs(query(collection(db, 'habitaciones'),where ('direccion.ciudad', '==', 'Barcelona' )));
         const habitaciones = [];
        datos.forEach((habitacion) => {
      habitaciones.push(habitacion.data());
      });
        setHabitaciones(habitaciones);
        setLoading(false)
          
      
        }
        getHabitaciones();
      },[])


      
      const agregarAFavoritos = async (habitacion) => {
        try {
          const user = auth.currentUser;
          if (!user) {
            toast.error("Debes iniciar sesión para añadir a favoritos");
            return;
          }
          const docData = {
            ...habitacion,
            usuarioUID: user.uid
          };
          const favoritosRef = collection(db, "favoritos");
          const querySnapshot = await getDocs(
            query(favoritosRef, where("tipoHabitacion", "==", habitacion.tipoHabitacion), where("direccion.ciudad", "==", habitacion.direccion.ciudad), 
            where("precio", "==", habitacion.precio), where("idHabitacion", "==", habitacion.idHabitacion))
          );
          if (!querySnapshot.empty) {
            toast.info("Esta habitación ya está en tu lista de favoritos");
            return;
          }
          const docRef = await addDoc(favoritosRef, docData);
          toast.success("¡Has añadido esta habitación a tu lista de favoritos!");
        } catch (error) {
          
            toast.error("Esta habitación ya está en tu lista de favoritos");
          
        }
      };
      




      return(
        <div>
           
      {loading ? <Container display="flex" justify="center"><Loading size="lg"/></Container> : 
      <ul>
        <Container xl 
        display="inline-flex"
        alignItems="center"
        justify="center"
        >
      {habitaciones.slice(0,3).map((habitacion, index)=> (
        <>
        <Link to={`/habitacion/${habitacion.idHabitacion}`}>
          <Card isHoverable isPressable key={index}  id="roomCard" css={{w:"290px", h:"400px"}}>
        <Card.Image
                src={`${habitacion.imagenes[0]}`}
                    objectFit="cover"
                    width="100%"
                    height="190px"
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

   
  

        </div>  
    )
}