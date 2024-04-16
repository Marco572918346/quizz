import { Box, Button, Container, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useSession } from "next-auth/react";
import useNavigation from "@/pages/api/routes/routes";
import { useRouter } from "next/router";
import apiClient from "../../apiClient";

const ValidateKeyLottery = () => {
  const [key, setKey] = useState('');
  const [keyError, setKeyError] = useState('');
  const router = useRouter();
  const { userId } = router.query;
  const navigation = useNavigation();
  const { data: session } = useSession();

  const validateKey = () => {
    if (!key.trim()) {
      setKeyError('La clave es necesaria');
      return false;
    }
    return true;
  };

  const handleJoinClick = async () => {
    console.log('handleJoinClick is called.');
  
    try {
      if (!validateKey()) {
        return;
      }
      
      const response = await apiClient.post('/api/gameGroupPlay', { userId: session?.user?.id, key });
  
      console.log('Response from api/gameGroupPlay:', response.data);
  
      if (response.data.userId) {
        const { userId } = response.data;
        console.log('El userId tiene un valor:', userId);
  
        // Redirigir al usuario a la ruta /lotteries
        router.push(`/lottery/create?userId=${userId}`);
        // Mensaje de consola para confirmar la redirección
        console.log('Redirection to /lotteries is triggered.');
      } else {
        console.error('El userId no tiene un valor válido:', userId);
        return;
      }
    } catch (error) {
      console.error('Error al unirse al grupo de juego:', error);
    }
  };
  

  const handleKeyChange = (event) => {
    setKey(event.target.value);
    // Limpiar el error cuando el usuario comienza a escribir
    setKeyError('');
  };

  return (
    <Box sx={{ marginTop: '60px', marginLeft: '300px', marginRight: '300px' }}>
      <Paper>
        <Typography sx={{ textAlign: 'center', fontFamily: 'fantasy', fontSize: '24px' }}>
          ¡Desbloquea tu oportunidad de ganar! Valida tu clave y únete a la emoción del juego de lotería.
        </Typography>
        <Container sx={{ margin: 'auto', marginTop: '50px' }}>
          <Box sx={{ textAlign: 'center' }}>
          <TextField
            id="key"
            variant="outlined"
            sx={{ width: '400px', height: '60px' }}
            label="Validar CLave"
            value={key}
            onChange={handleKeyChange}
            error={!!keyError}
            helperText={keyError}
          />
          </Box>
          <Box sx={{ textAlign: 'center', marginTop: '30px', marginBottom: '15px' }}>
            <Button 
              onClick={handleJoinClick}
              variant="contained" 
              color="success"
              sx={{ backgroundColor: "#0B7564", marginBottom: '20px' }} // Ajustamos el margen inferior directamente en el botón
              size="large"
            >
              Unirse
            </Button>
          </Box>
        </Container>
      </Paper>
    </Box>
  );
}

export default ValidateKeyLottery;
