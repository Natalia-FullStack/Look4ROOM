import { Center } from "@chakra-ui/react";
import { Button, Container, Link, Spacer, Text } from "@nextui-org/react";

export default function Error404() {
  return (
    <div>
      <Container fluid
      display="flex"
      direction="column"
      alignContent="center"
   
      >
      <Text color="error" h2>Error 404</Text>
      <p>Esta página no existe o se encuentra en construccion</p>
      <Spacer y={5} />
      
      <Link href="/">Volver a la pagina de inicio</Link>
      </Container>

    </div>
    
  );
}