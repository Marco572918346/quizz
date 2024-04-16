import db from '../../../../database/models';

export default function handler(req, res) {

    switch(req.method){
        case 'GET': 
            return getGameGroup(req, res);
        case 'POST':
            return createGameGroup(req, res);
        default:
            res.status(400).json({error: true, message:'Petición errónea, utiliza Read o Post'});
    }
}

const getGameGroup = async (req, res) => {
    const {key} = req.query;

    try {
        let gameGroup; 
        if (key){
            gameGroup = await db.GameGroups.findAll({
                where: {
                    key: key
                },
                include: {
                    model: db.Cards,
                    as: 'selectedCardsData', // Nombre de la asociación en el modelo GameGroups
                    attributes: ['id', 'cardName', 'typeCard', 'image_path'] // Atributos que deseas incluir
                }
            });
        }else {
            gameGroup = await db.GameGroups.findAll({
                include: {
                    model: db.Cards,
                    as: 'selectedCardsData', // Nombre de la asociación en el modelo GameGroups
                    attributes: ['id', 'cardName', 'typeCard', 'image_path'] // Atributos que deseas incluir
                }
            });
        }
        

         res.json(gameGroup);
    } catch (error) {
        console.log(error);
        let errors = []

        if (error.errors) {
            errors = error.errors.map((item) => ({
                error: item.message,
                field: item.path,
            }));
        }

        return res.status(400).json({
            message: `Ocurrió un error al procesar la petición: ${error.message}`,
            errors,
        });
    }
}

const createGameGroup = async (req, res) => {
    try {
        const { maxPlayers, typeCard } = req.body; // Obtenemos maxPlayers y typeCard del cuerpo de la solicitud

        // Generar un nombre aleatorio
        const groupName = generateRandomGroupName();
        
        // Generar una clave de 8 dígitos
        const key = generateRandomKey();

        // Buscar cartas por typeCard
        const cards = await db.Cards.findAll({
            where: {
                typeCard: typeCard
            }
        });

        // Crear el grupo de juego con maxPlayers del cuerpo de la solicitud
        const gameGroup = await db.GameGroups.create({
            groupName,
            key,
            maxPlayers,
            currentPlayers: 0, // Inicialmente no hay jugadores
        });

        // Asociar las cartas encontradas al grupo de juego creado
        await gameGroup.addSelectedCardsData(cards); 

        // Devolver el nombre del grupo y la clave generada
        return res.json({
            groupName: gameGroup.groupName,
            key: gameGroup.key,
            maxPlayers: gameGroup.maxPlayers,
            selectedCards: cards, // Devolvemos las cartas seleccionadas
            typeCard: typeCard
        });

    } catch (error) {
        console.log(error);
        let errors = []

        if (error.errors) {
            errors = error.errors.map((item) => ({
                error: item.message,
                field: item.path,
            }));
        }

        return res.status(400).json({
            message: `Ocurrió un error al procesar la petición: ${error.message}`,
            errors,
        });
    }
}

// Función para generar un nombre aleatorio
const generateRandomGroupName = () => {
    const adjectives = ['Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'Pink', 'Black', 'White', 'Gray'];
    const animals = ['Lion', 'Tiger', 'Bear', 'Wolf', 'Fox', 'Elephant', 'Giraffe', 'Zebra', 'Rabbit', 'Monkey'];
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
    return `${randomAdjective} ${randomAnimal}`;
};

// Función para generar una clave de 8 dígitos
const generateRandomKey = () => {
    const min = 10000000;
    const max = 99999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
};