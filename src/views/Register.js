import React, { useState } from "react";
import Nav from "../components/navbar/Nav";
import { Text, Input, Grid, Container, Card, Spacer, Row, Checkbox, Button, Radio, Progress, Tooltip,  Modal, useModal, Link } from "@nextui-org/react";
import { authContext, useAuth } from "../auth/authContext.js";
import toast, { Toaster } from 'react-hot-toast';
import { AiOutlineGoogle } from 'react-icons/ai';
import { storage } from "../firebase.config";
import { Center } from "@chakra-ui/react";
import Footer from "../components/footer/Footer";


export default function Register(){
  const [emailRegister, setEmailRegister]=useState("")
  const [passwordRegister, setPasswordRegister]=useState("")
  const [username, setUsername]=useState("")
  const [visibleRegister, setVisibleRegister]=useState(false);
  
  
  const [selected, setSelected] = useState(false);
  
  
  const { setVisible, bindings } = useModal();
  
  
  const auth=useAuth();
    const user=auth.user;
  //Modal de logout
  
  const modalRegister=()=>{setVisibleRegister(true); };
  const closeModalRegister = () => {
    
    window.location.href="/profile";
  };
  
    const handleRegister= async()=>{
  
   
    
      try{ 
        if(selected===true){
  
          if (passwordRegister.length < 8 || !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(passwordRegister)) {
            toast.error('La contraseña debe tener al menos 8 caracteres y contener al menos un carácter especial.');
            return; 
          }
        const response= await auth.register(emailRegister, passwordRegister, username)
     
        modalRegister();
        } else{
          toast.error('Debes aceptar la política de privacidad');
        }
  
        if (!username){
          toast.error('Debes introducir un nombre de usuario');
          
        } 
  
     } catch(error){
       toast.error(error.message)
       
  
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
          <Card css={{ mw: '420px', p: '10px', marginTop: '10px' , marginBottom: '20px'}}>
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
  
          {/*   <Radio.Group orientation="horizontal" label="Soy..." defaultValue="primary" >
        <Radio value="primary" color="primary" size="sm">
          Hombre
        </Radio>
        <Radio value="secondary" color="secondary" size="sm">
          Mujer
        </Radio>
        </Radio.Group> */}
  
        <Spacer y={1} />
  
            <Row justify="flex-start">
              <Checkbox value={selected} onChange={setSelected} isRequired/>
              <Spacer x={0.2}/><Text size={14}>Al registrarme, acepto la <Link onClick={() => setVisible(true)}>política de privacidad</Link></Text>
              
            </Row>
  
        
            <Spacer y={1} />
            <Button onPress={()=>handleRegister()}>Registrarse</Button>
            <br/>
            
  {/*           <Button color="danger"><AiOutlineGoogle/>&nbsp;¡Inicia sesión con Google!</Button>
   */}        </Card>
        </Container>
             <br></br> 
             <br></br>  <br></br>   

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
  
            La finalidad de la recopilación y tratamiento de los datos personales es la de poder ofrecer los servicios solicitados por el usuario, así como mejorar la calidad de los mismos y mantenerle informado sobre novedades y actualizaciones.
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
  
        <Modal
          closeButton
          blur
          aria-labelledby="modal-title"
          open={visibleRegister}
          onClose={closeModalRegister}
        >
  
          <Modal.Header>
            <Text h2 weight={"bold"} id="modal-title" color="success" >
             ¡Éxito!
               </Text> 
          </Modal.Header>
          <Modal.Body>
            <Spacer y={0.1} />
            <Center>
            {user && <Text h4 weight={"normal"} >¡Te has registrado correctamente! ¡Bienvenidx, {user.username}! </Text>}
            </Center>
            <Spacer y={0.4} />
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
             onPress={()=>closeModalRegister()}
  
             >
             Ir a tu perfil
            </Button>
  
           
        </Modal.Body>
      
       </Modal>
    <Spacer y={2}/>   
       <Footer/>
       
              </div>
          
              )
  }