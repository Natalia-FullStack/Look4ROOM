import React, { useState, useEffect } from "react";
import { Navbar, Button, Link, Text, Input, Dropdown,  Row, Checkbox, Modal, Tooltip, User, Google, Spacer, Image } from "@nextui-org/react";
import { Layout } from "./Layout.js";

 import toast, { Toaster } from 'react-hot-toast';
import { Mail } from "../login/Mail.js";
import { Password } from "../login/Password.js";
import { useAuth } from "../../auth/authContext.js";
import { AiOutlineGoogle, AiOutlineSearch } from "react-icons/ai";
import logo from "../../components/img/logo.png";
import './css/Nav.css';
import { Searchbar } from "../search/Searchbar.js";
import { Center } from "@chakra-ui/react";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../firebase.config.js";

export default function Nav() {
  const auth = useAuth();
  const user = auth.user;
  const useruid = user ? user.uid : null;
  const [visible, setVisible] = useState(false);
  const [visibleLogout, setVisibleLogout] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const [emailLogin, setEmailLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState(""); 
  const [avatarUrl, setAvatarUrl] = useState("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6pwdR-qoPy9qi-a4Vlk-3lbd8nK1KZ3b1o6WPdumMxNJ2V8DU");
  const [email, setEmail] = useState("");
  const [visibleForgot, setVisibleForgot] = useState(false);

  useEffect(() => {
    if (useruid) {
      const avatarRef = ref(storage, `avatars/${useruid}.png`);
      getDownloadURL(avatarRef)
        .then((url) => {
          setAvatarUrl(url);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [useruid]);

  const handleLogin = async () => {
    try {
      const response = await auth.login(emailLogin, passwordLogin);
      setAuthenticated(true);
      toast.success("¡Has iniciado sesión correctamente! ¡Bienvenido!");  
      setVisible(false);
    } catch (error) {
      setAuthenticated(false);
      setError(error.message);
      toast.error(error.message);
    }
  }

  const goToRegister = () => {
    window.location.href = "/register";
  }

  const handleForgotPassword = async () => {
    try {
      const response = await auth.resetPassword(email);
      toast.success("Te hemos enviado un email para que puedas cambiar tu contraseña");
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    }
  }

  const isEmailValid = () => {
    return email.trim() !== "";
  }

  const handleLogout = async () => {
    try {
      const response = await auth.logout();
      setAuthenticated(false);
      setVisibleLogout(true);
    } catch (error) {
      setAuthenticated(true);
      setError(error.message);
      toast.error(error.message);
    }
  }

  const handler = () => { setVisible(true); toast.dismiss(); };
  const closeHandler = () => { setVisible(false); };
  const handlerForgot = () => { closeHandler(); setVisibleForgot(true); };
  const closeForgot = () => { handler(); setVisibleForgot(false); };
  const closeHandlerLogout = () => { window.location.href = "/"; };
  const publicar = () => { window.location.href = "/publicar"; };

  const collapseItems = [
    <Link href="/" color="inherit">Inicio</Link>,
    <Link onPress={handler} color="inherit">Iniciar sesión</Link>,
    <Link href="register" color="inherit">Registrarse</Link>,
  ];

  const collapseAccount = [
    <Link href="/" color="inherit">Inicio</Link>,
    <Link href="/publicar" color="inherit">¡Anuncia tu habitación!</Link>,
    <Link href="/profile" color="inherit">Mi perfil</Link>,
    <Link onPress={handleLogout} color="inherit">Cerrar sesión</Link>
  ];

  return (
    <>
      <Toaster />
      <Layout>
        <Navbar isBordered variant="sticky">
          <Navbar.Toggle showIn="xs" />
          <Navbar.Brand>
            <Link href="/">
              <Image
                width={155}
                src={logo}
                alt="Default Image"
                objectFit="cover"
              />
            </Link>
          </Navbar.Brand>
          <Navbar.Content
            enableCursorHighlight
            activeColor="primary"
            hideIn="xs"
            variant="highlight-rounded"
          >
            <Searchbar id="searchbar" />
            <AiOutlineSearch id="searchmobile" />
          </Navbar.Content>
          <Navbar.Collapse>
            {collapseItems.map((item, index) => (
              <Navbar.CollapseItem
                key={index}
                activeColor="secondary"
                css={{
                  color: index === collapseItems.length - 1 ? "$error" : "",
                }}
                isActive={index === 2}
              >
                {item}
              </Navbar.CollapseItem>
            ))}
          </Navbar.Collapse>
          {user ? (
            <Navbar.Content
              css={{
                "@xs": {
                  w: "12%",
                  jc: "flex-end",
                },
              }}
            >
              <Button onPress={publicar} color="gradient" auto ghost id="buttonAnnounce">
                ¡Anuncia tu habitación!
              </Button>
              <Dropdown placement="bottom-right">
                <Dropdown.Trigger>
                  <User
                    bordered
                    as="button"
                    size="lg"
                    color="primary"
                    src={avatarUrl}
                  />
                </Dropdown.Trigger>
                <Dropdown.Menu color="primary" aria-label="User Actions">
                  <Dropdown.Item key="profile" css={{ height: "$18" }}>
                    <Text b color="inherit" css={{ d: "flex" }}>
                      Sesión iniciada como
                    </Text>
                    <Text b color="inherit" css={{ d: "flex" }}>
                      {user.email}
                    </Text>
                  </Dropdown.Item>
                  <Dropdown.Item key="settings" withDivider>
                    <Link href="/profile" color="inherit">
                      Mi perfil
                    </Link>
                  </Dropdown.Item>
                  <Dropdown.Item key="logout" color="error" withDivider>
                    <Link onPress={handleLogout} color="inherit">
                      Cerrar sesión
                    </Link>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Navbar.Content>
          ) : (
            <Navbar.Content
              css={{
                "@xs": {
                  w: "12%",
                  jc: "flex-end",
                },
              }}
            >
              <Tooltip content={"¡Se tardan SEGUNDOS!"} placement="bottom" color="primary">
                <Button  color="warning" onPress={goToRegister} auto id="register">¡Regístrate!</Button>
              </Tooltip>
              <Button auto  style={{ backgroundColor: '#7c878d'}} shadow onPress={handler} id="login">
                Iniciar sesión
              </Button>
            </Navbar.Content>
          )}
          <Navbar.Collapse>
            {user ? (
              collapseAccount.map((item, index) => (
                <Navbar.CollapseItem
                  key={index}
                  activeColor="secondary"
                  css={{
                    color: index === collapseAccount.length - 1 ? "$error" : "",
                  }}
                  isActive={index === 2}
                >
                  {item}
                </Navbar.CollapseItem>
              ))
            ) : (
              collapseItems.map((item, index) => (
                <Navbar.CollapseItem
                  key={index}
                  activeColor="secondary"
                  css={{
                    color: index === collapseItems.length - 1 ? "$error" : "",
                  }}
                  isActive={index === 2}
                >
                  {item}
                </Navbar.CollapseItem>
              ))
            )}
          </Navbar.Collapse>
        </Navbar>
      </Layout>

      {/* Modal de Login */}
      <Modal
        closeButton
        blur
        aria-labelledby="modal-title"
        open={visible}
        onClose={closeHandler}
      >
        <Toaster/>
        <Modal.Header>
          <Text id="modal-title" b size={18}>
            ¡Bienvenidx de vuelta!
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Spacer y={0.1} />
          <Input
            clearable
            bordered
            fullWidth
            color="primary"
            size="lg"
            labelPlaceholder="Email"
            name="email"
            required
            onChange={(e) => setEmailLogin(e.target.value)}
            contentLeft={<Mail fill="currentColor" />}
          />
          <Spacer y={0.4} />
          <Input
            clearable
            bordered
            fullWidth
            color="primary"
            size="lg"
            labelPlaceholder="Contraseña"
            onChange={(e) => setPasswordLogin(e.target.value)}
            required
            name="password"
            type="password"
            contentLeft={<Password fill="currentColor" />}
          />
          <Row justify="space-between">
            <Link onPress={handlerForgot}>
              <Text size={14} color="primary">Olvidé la contraseña</Text>
            </Link>
          </Row>
          <Button 
            auto 
            css={{ 
              borderRadius: '$xs',
              border: '$space$1 solid transparent',
              background: '$blue800',
              color: '$blue100',
              height: '$15',
              boxShadow: '$md',
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
            onPress={handleLogin}
          >
            Iniciar sesión
          </Button>
        </Modal.Body>
      </Modal>

      {/* Modal de Forgot Password */}
      <Modal
        closeButton
        blur
        aria-labelledby="modal-title"
        open={visibleForgot}
        onClose={closeForgot}
      >
        <Modal.Header>
          <Text id="modal-title" b size={18}>
            ¡Introduce tu email para que puedas reestablecer la contraseña!
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Spacer y={0.1} />
          <Input
            clearable
            bordered
            fullWidth
            color="primary"
            size="lg"
            labelPlaceholder="Email"
            name="email"
            required
            onChange={(e) => setEmail(e.target.value)}
            contentLeft={<Mail fill="currentColor" />}
          />
          <Spacer y={1} />
          <Button 
            auto 
            css={{
              borderRadius: '$xs',
              border: '$space$1 solid transparent',
              background: '$blue800',
              color: '$blue100',
              height: '$15',
              boxShadow: '$md',
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
            onPress={handleForgotPassword}
            disabled={!isEmailValid()}
          >
            Enviar email
          </Button>
        </Modal.Body>
      </Modal>

      {/* Modal de Logout */}
      <Modal
        closeButton
        blur
        aria-labelledby="modal-title"
        open={visibleLogout}
        onClose={closeHandlerLogout}
      >
        <Modal.Header>
          <Text h2 weight={"bold"} id="modal-title" color="success">
            ¡Éxito!
          </Text> 
        </Modal.Header>
        <Modal.Body>
          <Spacer y={0.1} />
          <Center>
            <Text h4 weight={"normal"}>
              ¡Has cerrado sesión correctamente! ¡Hasta pronto!
            </Text>
          </Center>
          <Spacer y={0.4} />
          <Button 
            auto 
            css={{ 
              borderRadius: '$xs',
              border: '$space$1 solid transparent',
              background: '$blue800',
              color: '$blue100',
              height: '$15',
              boxShadow: '$md',
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
            onPress={closeHandlerLogout}
          >
            Volver al inicio
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
}
