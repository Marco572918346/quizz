import db from '../../../../database/models';

export default function handler(req, res) {

    switch(req.method){

        case 'POST':
            return addGameGroup(req, res);
        default:
            res.status(400).json({error: true, message:'Petición errónea, utiliza Read o Post'});
    }
}

const addGameGroup = async (req, res) =>  {

    const { userId, key } = req.body;

    try {
        // Busca el grupo de juego por su clave de 8 dígitos
        const gameGroup = await db.GameGroups.findOne({ where: { key } });
        
        if (!gameGroup) {
            return res.status(404).json({ error: 'No se encontró un grupo de juego con esa clave' });
        }

        // Verifica si hay espacio disponible en el grupo de juego
        if (gameGroup.currentPlayers >= gameGroup.maxPlayers) {
            return res.status(400).json({ error: 'El grupo de juego está lleno' });
        }

        // Crea una nueva entrada en UserGameGroups para asociar al usuario con el grupo de juego
        await db.UserGameGroups.create({ userId, groupId: gameGroup.id });  
        
        // Incrementa el número de jugadores actuales en el grupo de juego
        await db.GameGroups.increment('currentPlayers', {
            by: 1,
            where: { id: gameGroup.id }
        });

        return res.json({userId, gameGroup, message: 'Agregado al juego' });
    } catch (error) {
        console.error('Error al unirse al grupo de juego:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}