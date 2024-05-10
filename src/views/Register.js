import React, { useState } from "react";
import Nav from "../components/navbar/Nav";
import { Text, Input, Container, Card, Spacer, Row, Checkbox, Button, Modal, useModal, Link } from "@nextui-org/react";
import toast, { Toaster } from 'react-hot-toast';
import { AiOutlineGoogle } from 'react-icons/ai';
import { storage } from "../firebase.config";
import { Center } from "@chakra-ui/react";
import Footer from "../components/footer/Footer";

export default function Register() {
  const [emailRegister, setEmailRegister] = useState("");
  const [passwordRegister, setPasswordRegister] = useState("");
  const [username, setUsername] = useState("");
  const [visibleRegister, setVisibleRegister] = useState(false);
  const [selected, setSelected] = useState(false);
  const { setVisible, bindings } = useModal();

  const modalRegister = () => {
    setVisibleRegister(true);
  };
  const closeModalRegister = () => {
    window.location.href = "/profile";
  };

  const handleRegister = async () => {
    try {
      if (selected === true) {
        if (passwordRegister.length < 8 || !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(passwordRegister)) {
          toast.error('La contraseña debe tener al menos 8 caracteres y contener al menos un carácter especial.');
          return;
        }
        // Register logic here
        modalRegister();
      } else {
        toast.error('Debes aceptar la política de privacidad');
      }
      if (!username) {
        toast.error('Debes introducir un nombre de usuario');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <Nav />
      <Container xl display="flex" alignItems="center" justify="center" css={{ minHeight: '80vh' }}>
        <Card css={{ mw: '420px', p: '10px' }}>
          <Text size={24} weight="bold" css={{ as: 'center', mb: '20px' }}>
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
          <Row justify="flex-start">
            <Checkbox value={selected} onChange={setSelected} isRequired />
            <Spacer x={0.2} /><Text size={14}>Al registrarme, acepto la <Link onClick={() => setVisible(true)}>política de privacidad</Link></Text>
          </Row>
          <Spacer y={1} />
          <Button onPress={handleRegister}>Registrarse</Button>
        </Card>
      </Container>
      {}
    </div>
  );
}
