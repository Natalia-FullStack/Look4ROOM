import { useEffect, useState } from "react"
import Nav from "../components/navbar/Nav";
import { Card, Container, Input, Spacer, Text, Textarea, Button, Radio, Progress, Checkbox, Col, Image, Modal } from "@nextui-org/react";
import { addDoc, collection } from "firebase/firestore";
import { db, storage } from "../firebase.config";
import { useAuth } from "../auth/authContext";
import { toast } from "react-hot-toast";
import { Center, Select } from "@chakra-ui/react";
import { Data } from "../components/json/Data";
import { AiOutlineWifi } from "react-icons/ai";
import {MdOutlineKitchen, MdBalcony} from "react-icons/md";
import {GrElevator, GrChannel} from "react-icons/gr";
import {RiTempHotLine} from "react-icons/ri";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Footer from "../components/footer/Footer";
import { Link } from "react-router-dom";



export default function Publish(){
  const auth=useAuth();
const user=auth.user


 const[calle, setCalle]=useState("");
 const[ciudad, setCiudad]=useState("");
 const [descripcion, setDescripcion]=useState("");
 const [precio, setPrecio]=useState("");
 const [imagenes, setImagenes]=useState([]);
 const [wifi, setWifi] = useState(false);
const [cocina, setCocina] = useState(false);
const [ascensor, setAscensor] = useState(false);
const [calefaccion, setCalefaccion] = useState(false);
const [terraza, setTerraza] = useState(false);
const [tv, setTv] = useState(false);
const [tipoHabitacion, setTipoHabitacion] = useState("");
const [numero, setNumero] = useState("");
const [visiblePublish, setVisiblePublish]=useState(false);
const [roomId, setRoomId]=useState(null);



//función para subir imágenes
const [image, setImage]=useState([])
const [photoURL, setPhotoURL]=useState("")
const [loading, setLoading]=useState(false);
const [imageUploaded, setImageUploaded] = useState(false);


const handleImageChange = (e) => {
  if (e.target.files[0]) {
    setImage(e.target.files[0]);
    setImageUploaded(false);
  }
};

const handleUploadSuccess = async (downloadURL) => {
  setPhotoURL(downloadURL);
  setImageUploaded(true);
};

 
//fecha de publicación
const fecha = new Date();


const [selectedCommunity, setSelectedCommunity] = useState(null);
const [selectedCity, setSelectedCity] = useState(null);


const handleCommunityChange = (event) => {
  setSelectedCommunity(event.target.value);
  setSelectedCity(null);
};


const modalPublish=()=>{setVisiblePublish(true); };
const closeModalPublish = () => {
  window.location.href="/";
};


const handleSubmit = async () => {
  const roomId = Math.floor(Math.random() * 1000000000);

  if (!calle || !ciudad || !selectedCommunity || !descripcion || !tipoHabitacion || !precio || !image) {
    toast.error('Rellena todos los campos.');
    return;
  }
  try {
    
    const storageRef = ref(storage, `rooms/${roomId}/imagen.jpg`);

    const metadata = { contentType: 'image/jpeg' };

    await uploadBytes(storageRef, image, metadata);

    const downloadURL = await getDownloadURL(storageRef);

    await addDoc(collection(db, `habitaciones`), {
      fechaPublicacion: fecha,
      idHabitacion: roomId,
      idVendedor: user.uid,
      nombreVendedor: user.username,
      emailVendedor: user.email,
      direccion: {
        calle: calle,
        numero: numero,
        ciudad: ciudad.toLowerCase(),
      },
      comunidadAuto: selectedCommunity,
      descripcion: descripcion,
      tipoHabitacion: tipoHabitacion,
      caracteristicas: {
        Cocina:cocina, 
        Wifi:wifi,
        Ascensor:ascensor, 
        Calefacción:calefaccion,
        Terraza:terraza,
        TV:tv
      },
      precio:precio,
      imagenes: imageUploaded ? [...imagenes, photoURL, downloadURL] : [...imagenes, downloadURL],
    });

    modalPublish();
    setRoomId(roomId);
  } catch (err) {
    toast.error(err.message);
  }
}

    
    return(
        
        <>
        <Nav/>

        <Container fluid
        display="flex"
        direction="column"
        alignItems="center"
        >

      <Spacer y={2}/>
     

      <Card css={{ /* $$cardColor: '$colors$primary' */ mw: "40rem", width:"40rem", }}>
        <Card.Body>
        <Spacer y={0.01} />
        <Text h4 weight={"bold"}>¿Dónde está la habitación?</Text>
          <Spacer y={0.01} />
         
        </Card.Body>
      </Card>
    
    <Spacer y={1}/>
    <Container fluid
        display="flex"
        direction="row"
        justify="center"
        alignItems="center">
    <Input 
    label="Calle"
    clearable
    placeholder="Calle Principal"
    width="20rem"
    onChange={(e) => setCalle(e.target.value)}

    
    />
    <Spacer x={7} />
     <Input 
    label="Número"
    clearable
    placeholder="12"
    width="10rem"
    onChange={(e) => setNumero(e.target.value)}

    
    />
 
 </Container>

<Spacer y={2}/>

    
    <div>
<Text weight="normal" h5>Comunidad autónoma</Text>
<Select value={selectedCommunity} onChange={handleCommunityChange} isRequired={true} width="40rem">
        <option value={null}></option>
        {Object.keys(Data).map((community) => (
          <option key={community} value={community}>
            {community}
          </option>
        ))}
      </Select>
      {selectedCommunity && (
        <div>
          <Spacer y={1} />
          <Text weight="normal" h5>Ciudad</Text>
          <Select value={selectedCity} onChange={(e)=>setCiudad(e.target.value)} isRequired={true}>
            <option value={null}>Selecciona una ciudad</option>
            {Data[selectedCommunity].map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </Select>
</div>
      )}
      </div>

    
    
    <Spacer y={2}/>

    <Card css={{ /* $$cardColor: '$colors$primary' */ mw: "40rem", width:"40rem", }}>
        <Card.Body>
        <Spacer y={0.01} />
        <Text h4 weight={"bold"}>Datos generales de la habitación</Text>
          <Spacer y={0.01} />
         
        </Card.Body>
      </Card>
<Spacer y={1}/>
    <Textarea 
    clearable
    label="Descripción de la habitación"
    placeholder="Proporciona una descripción de la habitación y del piso dónde se encuentra"
    onChange={(e) => setDescripcion(e.target.value)}
    minRows={6}
    minCols={6}
    width="40rem"
    isRequired={true}
    />
<Spacer y={2}/>


    <Text h5 >¿Qué tipo de habitación es?</Text>
 
    <Radio.Group size="xs" defaultValue="Individual" orientation="horizontal" value={tipoHabitacion} isRequired={true} onChange={setTipoHabitacion}>
      <Radio value="Individual">Habitación individual</Radio>
      <Radio value="Compartida">Habitación compartida</Radio>
      
    </Radio.Group>
      
      
     <Spacer y={2}/> 


     <Text h5 >Características generales de la vivienda</Text>
 
    <Container fluid
    display="inline-flex"
    justify="center"
    >
     <Checkbox color="success" value={wifi} size="sm"  onChange={setWifi}><AiOutlineWifi/>&nbsp;Wifi</Checkbox>
      <Spacer x={1}/>
      <Checkbox  color="success" value={cocina} size="sm" onChange={setCocina}><MdOutlineKitchen/>&nbsp;Cocina</Checkbox>
      <Spacer x={1}/>
      <Checkbox  color="success" value={ascensor} onChange={setAscensor} size="sm"><GrElevator/>&nbsp;Ascensor</Checkbox>

      </Container>
     
<Spacer y={1}/>
  <Container fluid
    display="inline-flex"
    justify="center"
    >
    <Checkbox color="success" value={calefaccion} onChange={setCalefaccion} size="sm"><RiTempHotLine/>&nbsp;Calefacción</Checkbox>
      <Spacer x={1}/>
      <Checkbox color="success" value={terraza} onChange={setTerraza}  size="sm"><MdBalcony/>&nbsp;Terraza</Checkbox>
      <Spacer x={1}/>
      <Checkbox color="success" value={tv} onChange={setTv} size="sm"><GrChannel/>&nbsp;TV</Checkbox>
      </Container>
       

 <Spacer y={2}/>

 <Center>
<Input
label="Coste al mes"
type="number"
clearable
width="40rem"
placeholder="100"
onChange={(e) => setPrecio(e.target.value)}
isRequired={true}
/>
</Center>
<Spacer y={2}/>

<Card css={{ /* $$cardColor: '$colors$primary' */ mw: "40rem", width:"40rem", }}>
        <Card.Body>
        <Spacer y={0.01} />
        <Text h4 weight={"bold"}>Foto de la habitación</Text>
          <Spacer y={0.01} />
         
        </Card.Body>
      </Card>
  <Spacer y={2}/>




<Input type="file" width="40rem" required onChange={handleImageChange}/>
    

     <Spacer y={2}/>
<Button  onPress={handleSubmit} type="submit" color="primary" auto>Publicar anuncio</Button>
</Container>
<Spacer y={2}/>
<Footer/>

<Modal
        closeButton
        blur
        aria-labelledby="modal-title"
        open={visiblePublish}
        onClose={closeModalPublish}
      >

        <Modal.Header>
          <Text h2 weight={"bold"} id="modal-title" color="success" >
           ¡Éxito!
             </Text> 
        </Modal.Header>
        <Modal.Body>
          <Spacer y={0.1} />
          <Center>
          <Text h4 weight={"semibold"} >¡Tu anuncio ha sido publicado! </Text>
          </Center>
          <Spacer y={0.4} />
          <Center>
          <Link to={`/habitacion/${roomId}`}>
          <Button 
           auto 
           css={{ 
             borderRadius: '$xs', // radii.xs
             border: '$space$1 solid transparent',
             background: '$blue800', // colors.pink800
             color: '$blue100',
             height: '$15', // space[12]
             boxShadow: '$md', // shadows.md
             '&:hover': {
               background: '$blue100',
               color: '$blue800',
             },
             '&:active': {
               background: '$blue200',
             },
             '&:focus': {
               borderColor: '$blue400',
             },
           }}
          
           >
          Ver anuncio
          </Button>
          </Link>
          </Center>
      </Modal.Body>
      
     </Modal>
     <Spacer y={2} />

        </>

    )
}

