import React from 'react';
import ValidateKeyLottery from '@/components/ValidateKey';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

function Lotteries() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleLotteryCreateClick = () => {
    if (session && session.user && session.user.id) {
      console.log('Navigating to lottery create with userId:', session.user.id);
      const destination = `/lottery/create?userId=${session.user.id}`;
      router.push(destination); // Manejar la redirección aquí
    } else {
      console.error('User session not found or user ID is missing.');
      // Podrías manejar esta situación de otra manera, como mostrando un mensaje de error al usuario.
    }
  };
  
  return (
    <div>
      <ValidateKeyLottery handleLotteryCreateClick={handleLotteryCreateClick} />
    </div>
  );
}

export default Lotteries;
