
import {
  Box,
  chakra,
  Container,
  Spacer,
  Stack,
  Text,
  useColorModeValue,
  VisuallyHidden,
} from '@chakra-ui/react';
import { FaInstagram, FaTwitter, FaFacebook, FaYoutube } from 'react-icons/fa';

const SocialButton = ({ children, label, href, bgColor, hoverBgColor }) => {
  const defaultBg = useColorModeValue('blackAlpha.100', 'whiteAlpha.100');
  const defaultHoverBg = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');

  const buttonBg = bgColor || defaultBg;
  const buttonHoverBg = hoverBgColor || defaultHoverBg;

  return (
    <chakra.button
      bg={buttonBg}
      rounded={'full'}
      w={8}
      h={8}
      cursor={'pointer'}
      as={'a'}
      href={href}
      display={'inline-flex'}
      alignItems={'center'}
      justifyContent={'center'}
      transition={'background 0.3s ease'}
      _hover={{
        bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};


export default function Footer() {
  return (
    <Box
      bg={useColorModeValue('gray.100', 'gray.800')}
      color={useColorModeValue('gray.700', 'gray.200')}
      as="footer"
      pos="absolute"
      bottom="0"
      left="0"
      right="0"
    >
      <Container
        as={Stack}
        maxW={'6xl'}
        py={4}
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}>

        <Text> © 2024 Look4ROOM.  Todos los derechos reservados</Text>
        <Stack direction={'row'} spacing={6}>
          <SocialButton label={'Twitter'} href={'https://x.com/'} bgColor={'#2fabe5'} hoverBgColor={'#229ccc'}>
            <FaTwitter />
          </SocialButton>

          <SocialButton label={'Instagram'} href={'https://www.instagram.com/'} bgColor={'#2fabe5'} hoverBgColor={'#229ccc'}>
            <FaInstagram />

          </SocialButton>

          <SocialButton label={'Facebook'} href={'https://www.facebook.com/'} bgColor={'#2fabe5'} hoverBgColor={'#229ccc'}>
            <FaFacebook />
          </SocialButton>

          <SocialButton label={'Youtube'} href={'https://www.youtube.com/'} bgColor={'#2fabe5'} hoverBgColor={'#229ccc'}>
            <FaYoutube />
          </SocialButton>
        </Stack>
      </Container>
    </Box>
  );
}