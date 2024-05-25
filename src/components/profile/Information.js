import { Avatar, Button, Container, Input, Loading, Modal, Spacer, Text } from "@nextui-org/react";
import { useAuth } from "../../auth/authContext"
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { FilePond } from "filepond";
import 'filepond/dist/filepond.min.css';
import { Center } from "@chakra-ui/react";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firebase.config";



export default function Information(){
    const [emailpassword, setEmailPassword]=useState("");
 
    const [visibleLogout, setVisibleLogout]=useState(false);
    const [avatar, setAvatar] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState("");

    const auth=useAuth();
    const user=auth.user;
   
    const useruid = user ? user.uid : null;
    

    const handleAvatarChange = (e) => {
      if (e.target.files[0]) {
        setAvatar(e.target.files[0]);
      }
    };

    const handleAvatarUpload = async () => {
      try {
        const storage = getStorage();
        const useruid=user.uid;
        const avatarRef = ref(storage, `avatars/${useruid}.png`);
        const metadata = { contentType: "image/png" };
        toast.success("Tu foto de perfil ha cambiado") 
        await uploadBytes(avatarRef, avatar, metadata);
        const avatarUrl = await getDownloadURL(avatarRef); 
        setAvatarUrl(avatarUrl);
        window.location.href="/profile";
      } catch (error) {
        toast.error("Se ha producido un error. Comprueba que el formato de la imagen esté correcto")
      }
    };

    useEffect(() => {
      if (useruid) {
        const avatarRef = ref(storage, `avatars/${useruid}.png`);
        getDownloadURL(avatarRef)
          .then((url) => {
            setAvatarUrl(url);
            console.log(url);
          });
      }
    }, [useruid]);
    



  //Modal de logout
  const handlerLogout=()=>{setVisibleLogout(true); };
  const closeHandlerLogout = () => {
    
    window.location.href="/";
  };
    const handleForgotPassword=async(e)=>{
        try{
          if(emailpassword===user.email){
            await auth.resetPassword(emailpassword);
            handlerLogout();
          } else{
            toast.error("El email introducido no es el mismo que el de tu cuenta")
          }
        }
        catch(error){
            toast.error(error.message)
        }
    }
    const isEmailValid = () => {
      return emailpassword.trim() !== "";
  }

 

  


    return(
        <div>
          
            <Text weight="bold" h5>Tu avatar</Text>
{user?
            <Avatar
          src={avatarUrl}
          css={{ size: "$20" }}
        /> : <Loading/>}

        <Spacer y={1} />
        <Text h6>Cambiar avatar</Text>
        <Input type="file" onChange={handleAvatarChange}/>
        <Spacer y={0.5} />
        <Button disabled={ !avatar} onPress={handleAvatarUpload}>Actualizar foto de perfil</Button>

      <Spacer y={2} />

        <Text weight="bold" h5>Tu nombre de usuario y email</Text>

           <Spacer y={1} />

                  
            <Text weight="normal" h6>Tu email</Text>
            {user ? <Input isBordered width="220px" readOnly placeholder={user.email}  /> : <Loading/> }
            <Spacer y={1} />

            <Text width="220px" weight="normal" h6>Tu nombre de usuario</Text>
            {user ? <Input isBordered width="220px" readOnly placeholder={user.username}  /> :<Loading/> }


            <Spacer y={2} />
            <Text weight="bold" h5>Cambiar contraseña</Text>
            <Text weight="normal" h6>Introduce tu email para poder cambiar tu contraseña</Text>
            <Input width="220px" placeholder="Email" value={emailpassword} onChange={(e) => setEmailPassword(e.target.value)} />
            <Spacer y={1} />
            <Button auto disabled={!isEmailValid()} css={{ 
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
           onPress={()=>handleForgotPassword()}>Cambiar contraseña</Button>
<Spacer y={2} />

<Modal
        closeButton
        blur
        aria-labelledby="modal-title"
        open={visibleLogout}
        onClose={closeHandlerLogout}
      >

        <Modal.Header>
          <Text h2 id="modal-title" b >
            Aviso
             </Text> 
        </Modal.Header>
        <Modal.Body>
          <Spacer y={0.1} />
          <Center>
          <Text h4 >Se ha enviado un email a tu correo electrónico</Text>
          </Center>
          <Center>
          <Text h4 weight={"bold"}>La sesión se ha cerrado</Text>
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
           onPress={()=>closeHandlerLogout()}

           >
           Volver al inicio
          </Button>

         
      </Modal.Body>
      
     </Modal>

        </div>
    )
}