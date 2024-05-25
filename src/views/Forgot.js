import { Center, Flex } from "@chakra-ui/react";
import Nav from "../components/navbar/Nav";
import FooterN from "../components/footer/OldFooterN";
import { useAuth } from "../auth/authContext";
import { Button, Container, Input, Spacer, Text } from "@nextui-org/react";
import { toast } from "react-hot-toast";
import { useState } from "react";

export default function Forgot() {
    const [email, setEmail]=useState("");
    const auth=useAuth();

    const handleForgotPassword=async(e)=>{
        e.preventDefault();
        try{
            const response=await auth.resetPassword(email)
            toast.success("Te hemos enviado un email para que puedas cambiar tu contraseña");
        } catch(error){
            toast.error(error);
        }
    }
    const isEmailValid = () => {
        return email.trim() !== "";
    }
  

    return (
        <div>
            <Nav/>
            <Flex minH="100vh" flexDirection="column" justifyContent="space-between">

        <Spacer y={2}/>
        <Container fluid
        display="flex"
        direction="column"
        alignContent="center"
        >
             <Text h3>Introduce tu email para que puedas reestablecer la contraseña!</Text> 
            <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
            <Spacer y={1}/>
            <Button auto css={{
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
            onPress={()=>handleForgotPassword()}
            disabled={!isEmailValid()} 
            >Enviar email</Button>

        </Container>
        <Spacer y={2}/>
        <FooterN/>
        </Flex>
        </div>
    )
    }
