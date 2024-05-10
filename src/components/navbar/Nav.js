import React, { useState, useEffect } from "react";
import { Navbar, Button, Link, Text, Input, Dropdown, Row, Spacer, Modal, User, Image } from "@nextui-org/react";
import { Layout } from "./Layout.js";
import { AiOutlineSearch } from "react-icons/ai";
import logo from "../../components/logo/logo.png";
import './css/Nav.css';
import { Searchbar } from "../search/Searchbar.js";


export default function Nav() {
  const [visibleLogout, setVisibleLogout] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("https://definicion.de/wp-content/uploads/2019/07/perfil-de-usuario.png");
  const [email, setEmail] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
  }, []);

  const handleLogout = async () => {
    setVisibleLogout(true);
  }

  const closeHandlerLogout = () => {
    setVisibleLogout(false);
  };

  const collapseItems = [
    <Link href="/" color="inherit">Inicio</Link>,
    <Link href="/register" color="inherit">Registrarse</Link>,
  ];

  const collapseAccount = [
    <Link href="/" color="inherit">Inicio</Link>,
  ];

  return (
    <>
      <Layout>
        <Navbar isBordered variant="sticky" >
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
                key={item}
                activeColor="secondary"
                css={{
                  color: index === collapseItems.length - 1 ? "$error" : "",
                }}
                isActive={index === 2}
              >
                <Link
                  color="inherit"
                  css={{
                    minWidth: "100%",
                  }}
                  href="#"
                >
                  {item}
                </Link>
              </Navbar.CollapseItem>
            ))}
          </Navbar.Collapse>
          <Link href="/register" color="inherit">
            <Button auto>Registrarse</Button>
          </Link>
        </Navbar>
      </Layout>
    </>
  )
}
