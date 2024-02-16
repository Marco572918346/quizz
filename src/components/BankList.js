import { Box, Card, CardContent, Paper, Typography  } from '@mui/material';
import { useEffect, useState } from 'react';
import AddBank from './modals/AddBank';

const BankList = ({banks}) => {
  const [bankList, setBankList] = useState([]);

  useEffect(() => {
    setBankList(banks);
  }, [banks]);

  const fetchBanks = async () => {
    try {
      const response = await apiClient.get('/api/banks');
      setBanks(response.data);
    } catch (error) {
      console.error('Error fetching banks:', error);
    }
  };

  const rechargeBanks = () => {
    fetchBanks();
  };

  const cardStyle = {
    marginBottom: '16px',
    backgroundColor: '#f5f5f5',
  };

  const paperStyle = {
    padding: '16px',
  };

  return (
    <div>
      <Box>
        <Paper style={paperStyle}>
          {/* Agrega el componente AddBank dentro de BankList */}
          <AddBank recharge={rechargeBanks} />
          {banks.map((bank) => (
            <Card key={bank.id} style={cardStyle}>
              <CardContent>
                <Typography variant="h6">{bank.name}</Typography>
                <Typography variant="body2">{bank.roomId}</Typography>
                {/* Puedes agregar más detalles según la estructura de tu modelo de datos */}
              </CardContent>
            </Card>
          ))}
        </Paper>
      </Box>
    </div>
  );
};

export default BankList;