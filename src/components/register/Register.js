import { useState } from "react";
import Nav from "../navbar/Nav";
import { Text, Input, Grid, Container, Card, Spacer, Row, Checkbox, Button, Radio, Progress, Tooltip,  Modal, useModal, Link } from "@nextui-org/react";
import toast, { Toaster } from 'react-hot-toast';




export default function Register(){
const [registered, setRegistered]=useState(false);
const [emailRegister, setEmailRegister]=useState("")
const [passwordRegister, setPasswordRegister]=useState("")
const [username, setUsername]=useState("")
const [image, setImage]=useState(null)
const [url, setUrl]=useState(null)


const [error, setError]=useState(null);
const [selected, setSelected] = useState(false);


const { setVisible, bindings } = useModal();


const auth=useAuth();
  const user=auth.user;


  const handleRegister= async()=>{

 
  
    try{ 
      if(selected===true){
      const response= await auth.register(emailRegister, passwordRegister, username, "user")
      setRegistered(true);
      toast.success('¡Te has registrado correctamente! ¡Bienvenido!')
      }else{
        toast.error('Debes aceptar la política de privacidad');
      }


   } catch(error){
     toast.error(error.message)
      setRegistered(false);

    }
  }
  

  


const handleImageChange=(e)=>{
  if(e.target.files[0]){
    setImage(e.target.files[0])
  }
}
    return(
        <div>
            <Nav/>
            
            <Container xl
        display="flex"
        alignItems="center"
        justify="center"
        css={{ minHeight: '80vh' }}
      >
        <Card css={{ mw: '420px', p: '10px' }}>
          <Text
            size={24}
            weight="bold"
            css={{
              as: 'center',
              mb: '20px',
            }}
          >
            Regístrate aquí
          </Text>
       
       {/*  <Progress color="primary" value={25} /> */}
        <Spacer y={1} />
         <Input
            clearable
            bordered
            fullWidth
            color="primary"
            size="lg"
            labelPlaceholder="Nombre y apellidos"
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            required
          /> 

<Spacer y={2} />
          <Input
            clearable
            bordered
            fullWidth
            color="primary"
            size="lg"
            labelPlaceholder="Email"
            onChange={(e) => setEmailRegister(e.target.value)}
            type="email"
            required
          />
          <Spacer y={2} />
          
          <Input
            clearable
            bordered
            fullWidth
            color="primary"
            size="lg"
            labelPlaceholder="Contraseña"
            type="password"
            onChange={(e) => setPasswordRegister(e.target.value)}
            required
          />
          <Spacer y={1} />

        {}

      <Spacer y={1} />

          <Row justify="flex-start">
            <Checkbox value={selected} onChange={setSelected} isRequired/>
            <Spacer x={0.2}/><Text size={14}>Al registrarme, acepto la <Link onClick={() => setVisible(true)}>política de privacidad</Link></Text>
            
          </Row>

      
          <Spacer y={1} />
          <Button onPress={()=>handleRegister()}>Registrarse</Button>
          <br/>
{/*      
 */}        </Card>
      </Container>
            
            

      {/* POLÍTICA DE PRIVACIDAD */	}
            
      <Modal
        scroll
        width="600px"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        {...bindings}
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            Política de privacidad
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Text id="modal-description">
          En cumplimiento de la legislación vigente en materia de protección de datos personales, se informa al usuario que los datos personales que se recogen a través de esta web serán tratados de forma confidencial y serán incorporados a un fichero automatizado debidamente registrado en la Agencia Española de Protección de Datos.
          <Spacer y={1} />
          Los datos personales proporcionados por el usuario podrán ser cedidos a terceros únicamente en el caso de que sea necesario para la prestación de los servicios contratados, siempre y cuando se respete la legislación en materia de protección de datos.
          El usuario podrá ejercer en todo momento sus derechos de acceso, rectificación, cancelación y oposición dirigiéndose por escrito al responsable del fichero a la dirección de correo electrónico indicada en la sección de contacto de esta web.
          
          <Spacer y={1} />
          <b>La utilización de esta web implica la aceptación de esta política de privacidad. Si no está de acuerdo con ella, le recomendamos que abandone la página web y no se registre.</b>
          </Text>
        </Modal.Body>
        <Modal.Footer>
    
          <Button auto onPress={() => setVisible(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
            
            <FooterN/>
            
            </div>
            
            )
}