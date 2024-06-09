import { addDoc, collection, doc, getDocs, query, where } from 'firebase/firestore';
import { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { auth, db, storage } from '../firebase.config';
import { Avatar, Button, Card, Checkbox, Container, Grid, Input, Loading, Modal, Row, Spacer, Text, Textarea } from '@nextui-org/react';
import Nav from '../components/navbar/Nav';
import { Box, Center } from '@chakra-ui/react';
import Footer from '../components/footer/Footer';
import { toast } from 'react-hot-toast';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { icon, map } from 'leaflet';
import 'leaflet-control-geocoder/dist/Control.Geocoder';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import { Icon } from 'leaflet';
import { getDownloadURL, ref } from 'firebase/storage';
import { FaShare } from 'react-icons/fa';
import './css/Habitacion.css'
import { HeartIcon } from '../components/homerooms/HeartIcon';
import emailjs from 'emailjs-com';
import { useAuth } from '../auth/authContext';


export default function Habitacion() {
  const { idHabitacion } = useParams();
  const idHabitacionNum = parseInt(idHabitacion);
  const auth=useAuth();
  const user=auth.user;


  const [habitaciones, setHabitaciones] = useState([]);
  const [loading, setLoading] = useState(false);
 
  const [visible, setVisible] = useState(false);
  const [avatarId, setAvatarId] = useState('');
  const [avatarUrl, setAvatarUrl] = useState("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6pwdR-qoPy9qi-a4Vlk-3lbd8nK1KZ3b1o6WPdumMxNJ2V8DU");

  const handler = () => setVisible(true);

  const closeHandler = () => {
    setVisible(false);
    console.log("closed");
  };
 
  
  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm('service_4aosh4a', 'template_hmmusb7', e.target, 'X8BJ9AQdLsYsHw5od')

      .then((result) => {
        toast.success('El email se ha enviado exitosamente');
      }, (error) => {
        console.error('Error al enviar el correo', error);
      });
  };

  const [mapCenter, setMapCenter] = useState([0,0]);


  useEffect(() => {
    const getHabitaciones = async () => {
      setLoading(true);
  
      const datos = await getDocs(
        query(collection(db, 'habitaciones'), where('idHabitacion', '==', idHabitacionNum))
      );
  
      const habitaciones = [];
  
      datos.docs.forEach((doc) => {
        habitaciones.push(doc.data());
        setAvatarId(doc.data().idVendedor);
      });
  
      setHabitaciones(habitaciones);
      setLoading(false);
  
      if (habitaciones.length > 0) {
        const currentHabitacion = habitaciones[0];
        geocodeAddress(currentHabitacion);
      }
    }
  
    getHabitaciones();
  


    
  
  }, [idHabitacionNum]);
  
  const geocodeAddress = async (currentHabitacion) => {
    const address = `${currentHabitacion.direccion.calle} ${currentHabitacion.direccion.numero} ${currentHabitacion.direccion.ciudad}`;
    const geocoder = new L.Control.Geocoder.Nominatim();
    setLoading(true);
    
    await geocoder.geocode(address, (results) => {
      if (results && results.length > 0) {
        const location = results[0].center;
        console.log('Coordinates:',[location.lat, location.lng]);
        setMapCenter([location.lat, location.lng]);
        setLoading(false);
       
      } else {
        
        setLoading(false)
      }
      

    });
  }; 


  const agregarAFavoritos = async (habitacion) => {
    try {
    const user = auth.user;
    
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
  
 

















  const avatarRef = ref(storage, `avatars/${avatarId}.png`);
  getDownloadURL(avatarRef)
    .then((url) => {
      setAvatarUrl(url);
    });

  
  if (loading) {
    return <><Nav/><Center><Loading /></Center></>;
  }

  if(!habitaciones.length){
    return <><Nav/> <Center><Text h1 color="error">Error</Text></Center> <Center><Text h2>No se ha encontrado esta habitación</Text></Center><Center><Text h3>Es posible que se haya eliminado</Text></Center></>
  }
  


  return (
    <div>
      <Nav />
      <>
        {habitaciones.map((habitacion, index) => (
           <div key={index}>
         

              <Grid.Container gap={2} justify="center">
<Grid xs={2}></Grid>
              <Grid xs={7} direction='column'>
              <img
                src={habitacion.imagenes}
                alt="Imagen de la habitación"
                width="95%"
              />
          </Grid>
          <Grid xs={3}></Grid>
          <Grid xs={1}></Grid>
  <Grid xs={6} direction='column'>
                
                  <Text h2 weight={"bold"} >
                    Alquiler de Habitación {habitacion.tipoHabitacion} en{" "}
                    {habitacion.direccion.ciudad.charAt(0).toUpperCase() +
                      habitacion.direccion.ciudad.slice(1) } 
                  </Text>
               
                  <Text weight={"normal"}  h4>
                    {habitacion.direccion.calle}, {habitacion.direccion.numero} 
                  </Text>
                  
                  <Text weight={"bold"} h3 >
                    {habitacion.precio}€/mes</Text>
                 <Spacer y={1}/>
                    <Container fluid display='inline-flex'>
               {Object.entries(habitacion.caracteristicas)
    .filter(([, value]) => value)
    .map(([key, value], index, filteredEntries) => (
     
      <Fragment key={index} >
        <div><Text h4 weight={"normal"}>&nbsp;{key}&nbsp; </Text></div>
        {index !== filteredEntries.length - 1 && <div style={{marginLeft:"5px", marginRight:"5px"}}><Text h4> | </Text> </div>}
      </Fragment>
      

    ))}
    </Container>
    <Spacer y={1}/>
    <Box display="flex"  >
    <Button id="heart"
        auto
        color="error"
        icon={<HeartIcon fill="currentColor" filled />}
        onPress={() => agregarAFavoritos(habitacion)}
      >Añadir a favoritos</Button>
      <Spacer x={1} />

      <Button id="compartir"
     auto
      color="primary"
      onPress={handler}
      icon={<FaShare fill="currentColor" filled/>}
      >Compartir</Button></Box>
              <Spacer y={2.5}/>
             
             
                <Text h3>Descripción del propietario</Text>
                <Text h4 weight={"normal"}>{habitacion.descripcion}</Text>
                <Spacer y={2.5}/>

              <Text h3>Localización</Text>
              <Text size={18}>La habitación se encuentra en {habitacion.direccion.calle}, {habitacion.direccion.numero}.</Text>
                {loading ? <Loading/> :<MapContainer id="mapa" center={mapCenter} zoom={15} style={{ width: '100%', height: '300px' }}>
    <TileLayer
      attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <Marker position={mapCenter} icon={icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    })}>
      <Popup>
      {habitacion.direccion.calle}, {habitacion.direccion.numero}
      </Popup>
    </Marker>
  </MapContainer>
  }
  <Spacer y={2.5}/>

<form onSubmit={sendEmail}id='formMobile' style={{border: '1px solid #000', borderRadius: '6px', padding: '20px'}}>
  <Box display="flex" flexDirection="row" >
      <Avatar src={avatarUrl} size="lg" />
    
        <Text h5>Contactar con {habitacion.nombreVendedor}</Text>
        </Box>
        <Spacer y={1} />
        <Input width='140px' name="Nombre" required={true} label="Nombre" placeholder="Nombre" />
        <Spacer y={0.8} />
        <Input width='140px'name="email" required={true} label="Correo electrónico" placeholder="Correo electrónico" />
        <Spacer y={0.8} />
        <div id='destinatario'>
        <Input required={true} name="destinatario" width='15px' label="Destinatario" value={habitacion.emailVendedor} isBordered readOnly />
        </div>
        <Spacer y={2} />
        
        <Textarea bordered width="100%" minRows={7} labelPlaceholder="Escribe tu mensaje aquí" name="mensaje" />

<Spacer y={2} />
<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
  <Button type="submit" auto color="primary">Enviar correo</Button>
</div>
</form>

              </Grid>
              <Grid xs={3} css={{ display: "flex", flexDirection: "column", justifyContent: "flex-start" }} id='gridContact'>
  <Card isHoverable borderWeight='normal' variant="bordered" css={{ mw: "400px" }}>
  





<form onSubmit={sendEmail} >


  <div style={{ marginLeft: '10px', marginRight: '5px' }}>

    <Spacer y={1} />
    <Box display="flex" flexDirection="row">
      <Avatar src={avatarUrl} size="lg" />
      <Text h3>   Contactar con {habitacion.nombreVendedor}</Text>
    </Box>

    <Spacer y={1} />
      <Input width="100%" name="Nombre" required={true} label="Nombre" placeholder="Nombre" />
    <Spacer y={0.8} />
      <Input width="100%" name="email"  required={true} label="Correo electrónico" placeholder="Correo electrónico" />
    <Spacer y={0.8} />
    <div id="destinatario">
      <Input required={true} name="destinatario" width='200px' label="Destinatario" value={habitacion.emailVendedor} isBordered readOnly />
    </div>
    <Spacer y={2} />

    <Textarea bordered width="100%" minRows={7} labelPlaceholder="Escribe tu mensaje aquí" name="mensaje" />
  </div>

  <Card.Footer>
    <Row justify="end">
      <Button type="submit" auto color="primary">Enviar correo</Button>
    </Row>
  </Card.Footer>
</form>

  </Card>
</Grid>
  </Grid.Container>


              <Modal
        closeButton
        aria-labelledby="modal-title"
        open={visible}
        onClose={closeHandler}
        width="600px"

      >
{/*       
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '300px' }}
          center={mapCenter}
          zoom={15}
        >
          <Marker position={mapCenter} />
        </GoogleMap>
      </LoadScript>
       */}

<Modal.Header>
  <Text id="modal-title" size={22} weight={"bold"}>
    ¡Comparte el enlace de la habitación!
  </Text>
</Modal.Header>
<Modal.Body>
  
<Spacer y={0.5} />
<Input type="text" width='100%' isBordered readOnly  label="Enlace" value={`https://tfg-natalia2024.firebaseapp.com/habitacion/${idHabitacionNum}`} />
<Spacer y={1} />

</Modal.Body>
{}
      </Modal>     
          </div>
          
        ))}
                  
      </>
      <Spacer y={2}/>   

      <Footer/>

         
    </div>
    
  );

}