import { useEffect, useState } from "react"
import Nav from "../components/navbar/Nav";
import { Card, Container, Input, Spacer, Text, Textarea, Button, Radio, Progress, Checkbox, Col, Modal, Loading } from "@nextui-org/react";
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, query, updateDoc, where, writeBatch } from "firebase/firestore";
import { db, storage  } from "../firebase.config";
import { useAuth } from "../auth/authContext";
import { toast } from "react-hot-toast";
import { Select, Center } from "@chakra-ui/react";
import { Data } from "../components/json/Data";
import { AiOutlineWifi } from "react-icons/ai";
import {MdOutlineKitchen, MdBalcony} from "react-icons/md";
import {GrElevator, GrChannel} from "react-icons/gr";
import {RiTempHotLine} from "react-icons/ri";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Link, useParams } from "react-router-dom";
import Habitacion from "./Habitacion";
import Footer from "../components/footer/Footer";




export default function Edit(){
  const auth=useAuth();
const user=auth.user;
const {idHabitacion}=useParams();
const idHabitacionNum=parseInt(idHabitacion);
const [habitacion, setHabitacion] = useState({});
const [visibleLogout, setVisibleLogout] = useState(false);
 const[calle, setCalle]=useState("");
 const[ciudad, setCiudad]=useState("");
 const [descripcion, setDescripcion]=useState("");
 const [precio, setPrecio]=useState("");
 const [wifi, setWifi] = useState(false);
const [cocina, setCocina] = useState(false);
const [ascensor, setAscensor] = useState(false);
const [calefaccion, setCalefaccion] = useState(false);

const [terraza, setTerraza] = useState(false);
const [tv, setTv] = useState(false);
const [tipoHabitacion, setTipoHabitacion] = useState("");
const [numero, setNumero] = useState("");
const [documentIdHabitaciones, setDocumentIdHabitaciones] = useState(null); 



//función para subir imágenes
const [loading, setLoading]=useState(false);

//Modal de logout
const handlerLogout=()=>{setVisibleLogout(true); };
const closeHandlerLogout = () => {
  
  setVisibleLogout(false);
};

const [selectedCommunity, setSelectedCommunity] = useState(null);
const [selectedCity, setSelectedCity] = useState(null);

const handleCommunityChange = (event) => {
  setSelectedCommunity(event.target.value);
  setSelectedCity(null);
};






//Para recuperar los datos de la habitación de la BBDD "habitaciones"
useEffect(() => {
  const getHabitaciones = async () => {
    setLoading(true);

    const datos = await getDocs(
      query(collection(db, 'habitaciones'), where('idHabitacion', '==', idHabitacionNum))
    );

    datos.docs.forEach((doc) => {
      setHabitacion(doc.data());
      setDocumentIdHabitaciones(doc.id);
    });

    setLoading(false);
  }

  getHabitaciones();
}, [idHabitacionNum]);


const updateFavoritos = async () => {
  const favoritosQuerySnapshot = await getDocs(
    query(collection(db, 'favoritos'), where('idHabitacion', '==', idHabitacionNum))
  );

  const favoritosBatch = writeBatch(db);
  favoritosQuerySnapshot.forEach((doc) => {
    favoritosBatch.update(doc.ref, {
      direccion: {
        calle: calle || habitacion.direccion.calle,
        numero: numero || habitacion.direccion.numero,
        ciudad: ciudad || habitacion.direccion.ciudad,
      },
      comunidadAuto: selectedCommunity || habitacion.comunidadAuto,

      descripcion: descripcion || habitacion.descripcion,
      tipoHabitacion: tipoHabitacion || habitacion.tipoHabitacion,
      caracteristicas: {
        wifi: wifi || habitacion.caracteristicas.Wifi,
        cocina: cocina || habitacion.caracteristicas.Cocina,
        ascensor: ascensor || habitacion.caracteristicas.Ascensor,
        calefaccion: calefaccion || habitacion.caracteristicas.Calefacción,
        terraza: terraza || habitacion.caracteristicas.Terraza,
        tv: tv || habitacion.caracteristicas.TV,
      },
      precio: precio || habitacion.precio,
    });
  });
  await favoritosBatch.commit();
};
   

const handleSubmit = async () => {
  try {
    setLoading(true);

    const habitacionRef = doc(db, 'habitaciones', documentIdHabitaciones);

    await updateDoc(habitacionRef, {
      direccion: {
        calle: calle || habitacion.direccion.calle,
        numero: numero || habitacion.direccion.numero,
        ciudad: ciudad || habitacion.direccion.ciudad,
      },
      comunidadAuto: selectedCommunity || habitacion.comunidadAuto,
      descripcion: descripcion || habitacion.descripcion,
      tipoHabitacion: tipoHabitacion || habitacion.tipoHabitacion,
      caracteristicas: {
        Wifi: wifi || habitacion.caracteristicas.Wifi,
        Cocina: cocina || habitacion.caracteristicas.Cocina,
        Ascensor: ascensor || habitacion.caracteristicas.Ascensor,
        Calefacción: calefaccion || habitacion.caracteristicas.Calefacción,
        Terraza: terraza || habitacion.caracteristicas.Terraza,
        TV: tv || habitacion.caracteristicas.TV,
      },
      precio: precio || habitacion.precio,
    });
    await updateFavoritos();

    setLoading(false);
    setVisibleLogout(true);
  } catch (error) {
    toast.error(error.message);
    setLoading(false);
  }
};






return (
  <>
    <Nav />

    <Spacer y={1} />

    <Center>
      
    <Text h2 weight={"bold"} >
                    Alquiler de Habitación {habitacion.tipoHabitacion} en{" "}
                    {habitacion.direccion?.ciudad.charAt(0).toUpperCase() +
                      habitacion.direccion?.ciudad.slice(1) } 
                  </Text>
    </Center>

    <Spacer y={1} />
    {loading ? (
      <Center>
        <Loading />
      </Center>
    ) : (
      <>
        <Container
          fluid
          display="flex"
          direction="column"
          alignItems="center"
        >
           <Card css={{ /* $$cardColor: '$colors$primary' */ mw: "40rem", width:"40rem", }}>
        <Card.Body>
        <Spacer y={0.01} />
        <Text h4 weight={"bold"}>¿Dónde está la habitación?</Text>
          <Spacer y={0.01} />
         
        </Card.Body>
      </Card>
          <Spacer y={1} />
          <Container
            fluid
            display="flex"
            direction="row"
            justify="center"
            alignItems="center"
          >
            <Input
              label="Calle"
              clearable
              placeholder={calle || habitacion.direccion?.calle || ""}
              width="20rem"
              onChange={(e) => setCalle(e.target.value)}
            />
            <Spacer x={7} />
            <Input
              label="Número"
              clearable
              placeholder={numero || habitacion.direccion?.numero || ""}
              width="10rem"
              onChange={(e) => setNumero(e.target.value)}
            />
          </Container>

          <Spacer y={2} />

          <div>
            <Text weight="normal" h5>
              Comunidad autónoma
            </Text>
            <Select
              value={selectedCommunity}
              onChange={handleCommunityChange}
              isRequired={true}
              width="40rem"
            >
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
                <Text weight="normal" h5>
                  Ciudad
                </Text>
                <Select
                  value={selectedCity}
                  onChange={(e) => setCiudad(e.target.value)}
                  isRequired={true}
                >
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

          <Spacer y={2} />

          <Card css={{ /* $$cardColor: '$colors$primary' */ mw: "40rem", width:"40rem", }}>
        <Card.Body>
        <Spacer y={0.01} />
        <Text h4 weight={"bold"}>Datos generales de la habitación</Text>
          <Spacer y={0.01} />
         
        </Card.Body>
      </Card>
          <Spacer y={2} />

          <Textarea
            clearable
            label="Descripción de la habitación"
            placeholder={descripcion || habitacion.descripcion || ""}
            onChange={(e) => setDescripcion(e.target.value)}
            minRows={6}
            minCols={6}
            width="40rem"
            isRequired={true}
          />
          <Spacer y={2} />

          <Text h5>¿Qué tipo de habitación es?</Text>
          <Text h6>Selección anterior: {habitacion.tipoHabitacion}</Text>

          <Radio.Group
            size="xs"
            defaultValue="Individual"
            orientation="horizontal"
            value={tipoHabitacion || habitacion.tipoHabitacion || ""}
            isRequired={true}
            onChange={setTipoHabitacion}
          >
            <Radio value="Individual">Habitación individual</Radio>
            <Radio value="Compartida">Habitación compartida</Radio>
          </Radio.Group>

          <Spacer y={2} />

          <Text h5>Características</Text>

          <Container
            fluid
            display="inline-flex"
            justify="center"
          >
            <Checkbox color="success" value={wifi} size="sm" onChange={setWifi}>
              <AiOutlineWifi />&nbsp;Wifi
            </Checkbox>
            <Spacer x={1} />
            <Checkbox color="success" value={cocina} size="sm" onChange={setCocina}>
              <MdOutlineKitchen />&nbsp;Cocina
            </Checkbox>
            <Spacer x={1} />
            <Checkbox color="success" value={ascensor} onChange={setAscensor} size="sm">
              <GrElevator />&nbsp;Ascensor
            </Checkbox>
          </Container>

          <Spacer y={1} />

          <Container
            fluid
            display="inline-flex"
            justify="center"
          >
            <Checkbox color="success" value={calefaccion} onChange={setCalefaccion} size="sm">
              <RiTempHotLine />&nbsp;Calefacción
            </Checkbox>
            <Spacer x={1} />
            <Checkbox color="success" value={terraza} onChange={setTerraza} size="sm">
              <MdBalcony />&nbsp;Terraza
            </Checkbox>
            <Spacer x={1} />
            <Checkbox color="success" value={tv} onChange={setTv} size="sm">
              <GrChannel />&nbsp;TV
            </Checkbox>
          </Container>

          <Spacer y={2} />

          <Card css={{ /* $$cardColor: '$colors$primary' */ mw: "40rem", width:"40rem", }}>
        <Card.Body>
        <Spacer y={0.01} />
        <Text h4 weight={"bold"}>Precio</Text>
          <Spacer y={0.01} />
         
        </Card.Body>
      </Card>

          <Spacer y={2} />
          <Input
            label="Coste al mes"
            type="number"
            clearable
            width="40rem"
            placeholder={precio || habitacion.precio || ""}
            onChange={(e) => setPrecio(e.target.value)}
            isRequired={true}
          />

          <Spacer y={2} />

          {/* <Card css={{ mw: "40rem", width: "40rem", height: "5rem" }}>
            <Card.Body>
              <Text h5>Fotos</Text>
            </Card.Body>
          </Card>

          <Spacer y={2} />

          <Input type="file" required onChange={handleImageChange}/> */}

          <Spacer y={2} />

          <Button onPress={handleSubmit} type="submit" color="primary" auto>
            Actualizar anuncio
          </Button>
        </Container>
      </>
    )}

    <Spacer y={2} />

    <Footer />

    <Modal
      closeButton
      blur
      aria-labelledby="modal-title"
      open={visibleLogout}
      onClose={closeHandlerLogout}
    >
      <Modal.Header>
        <Text h2 weight={"bold"} color="success"  id="modal-title" b>
          ¡Éxito!
        </Text>
      </Modal.Header>
      <Modal.Body>
        <Spacer y={0.1} />
          <Center>
          <Text h4>¡Tu anuncio se ha actualizado!</Text>
          </Center>
        <Spacer y={0.4} />
        <Center>
        <Link to={`/habitacion/${idHabitacionNum}`}>
          <Button
            auto
            css={{
              borderRadius: "$xs",
              border: "$space$1 solid transparent",
              background: "$blue800",
              color: "$blue100",
              height: "$15",
              boxShadow: "$md",
              "&:hover": {
                background: "$blue100",
                color: "$blue800",
              },
              "&:active": {
                background: "$blue200",
              },
              "&:focus": {
                borderColor: "$blue400",
              },
            }}
          >
            Ver los cambios
          </Button>
        </Link>
        </Center>
      </Modal.Body>
    </Modal>
  </>
);
}

