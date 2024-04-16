import { Container, Grid, Typography, Button, Box } from "@mui/material";
import { useState, useEffect } from "react";
import Image from "next/image";
import apiClient from "../../../apiClient";

const BackendConfig = {
  urlBasePath: 'http://localhost:3000/api/card/view?file='
};

const GetLotteryUser = ({ key }) => {
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

  useEffect(() => {
    fetchImages(key);
  }, [key]);

  const fetchImages = async () => {
    try {
      const response = await apiClient.get(`/api/gameGroups?key=${key}`);
      if (response.data && response.data.length > 0) {
        const images = response.data.reduce((acc, group) => {
          acc.push(...group.selectedCardsData.map(card => ({
            ...card,
            image_path: `${BackendConfig.urlBasePath}${card.image_path}`
          })));
          return acc;
        }, []);
        setImages(images);
      } else {
        console.error('No se encontraron datos de imágenes en la respuesta:', response);
      }
    } catch (error) {
      console.error('Error al obtener las imágenes:', error);
    }
  };

  const toggleImageSelection = (image) => {
    setSelectedImages((prevSelectedImages) => {
      if (prevSelectedImages.includes(image)) {
        return prevSelectedImages.filter((selectedImage) => selectedImage !== image);
      } else {
        return [...prevSelectedImages, image];
      }
    });
  };

  const handleLoteriaButtonPress = () => {
    if (selectedImages.length !== 16) {
      alert('Por favor, selecciona todas las imágenes para ganar a la lotería.');
      return;
    }
    alert('¡Felicitaciones! Has ganado la lotería.');
    // Redireccionar después de participar en la lotería
    // router.push('/lotteryValidate');
  };

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Selecciona tus imágenes para la lotería
      </Typography>
      <Grid container spacing={2}>
        {images.map((image, index) => (
          <Grid item key={index} xs={6} sm={3}>
            <Image 
              src={image.image_path}
              alt={`Image-${index}`}
              onClick={() => toggleImageSelection(image)}
              style={{ border: selectedImages.includes(image) ? '2px solid blue' : 'none' }}
              width={200}
              height={200}
            />
          </Grid>
        ))}
      </Grid>
      <Box mt={4} textAlign="center">
        <Button variant="contained" color="primary" onClick={handleLoteriaButtonPress}>
          Participar en la lotería
        </Button>
      </Box>
    </Container>
  );
};

export default GetLotteryUser;
