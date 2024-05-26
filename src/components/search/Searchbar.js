import React, { useState } from "react";
import { Button, Card, Container, Input, Link, Spacer, Text } from "@nextui-org/react";
import { AiOutlineSearch } from "react-icons/ai";
import './css/Search.css'

export const Searchbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  
  const handleClick = () => {
 
    window.location.href=`/results/${searchTerm}`;
  };
  return (
    <div>
      <Container
      display="inline-flex"
      flexDirection="row"
      id="searchbar"
      >
      <Input
        type="text"
        width="280px"
        placeholder="Busca por ciudad"
        onChange={(e) => setSearchTerm(e.target.value)}
        clearable
       
      />     
      
      <Button style={{ backgroundColor: '#2fabe5'}} onClick={handleClick} auto><AiOutlineSearch/></Button>
     
</Container>

    </div> 
  );
};
