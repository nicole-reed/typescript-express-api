import express from 'express';
import AWS from 'aws-sdk';
import handleError from './handleError';
import NotFoundError from './errors/notFound.error';

require('dotenv').config();

const app = express();
app.use(express.json()); // need to do this to be able to parse body

AWS.config.update({
  region: process.env.AWS_DEFAULT_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'characters';

const getCharacters = async () => {
  const params = {
    TableName: TABLE_NAME,
  };
  const { Items } = await dynamoClient.scan(params).promise();
  return Items || [];
};

const getCharacterById = async (id: string) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id,
    },
  };

  const { Item } = await dynamoClient.get(params).promise();

  if (!Item) {
    throw new NotFoundError('Not Found');
  }

  return Item;
};

const addOrUpdateCharacter = async (character: object) => {
  const params = {
    TableName: TABLE_NAME,
    Item: character,
  };

  const result = await dynamoClient.put(params).promise();
  return result;
};

const deleteCharacter = async (id: string) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id,
    },
  };

  const result = await dynamoClient.delete(params).promise();
  return result;
};

app.get('/', (req, res) => {
  res.send('<h1>Hello World.</h1>');
});

app.get('/characters', async (req, res) => {
  try {
    const characters = await getCharacters();
    res.json({ characters });
  } catch (error) {
    handleError(error, res);
  }
});

app.get('/characters/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const character = await getCharacterById(id);
    res.json({ character });
  } catch (error) {
    handleError(error, res);
  }
});

app.post('/characters', async (req, res) => {
  const character = req.body;
  try {
    const newCharacter = await addOrUpdateCharacter(character);
    res.json(newCharacter);
  } catch (error) {
    handleError(error, res);
  }
});

app.put('/characters/:id', async (req, res) => {
  const character = req.body;
  const { id } = req.params;
  character.id = id;
  try {
    const updatedCharacter = await addOrUpdateCharacter(character);
    res.json(updatedCharacter);
  } catch (error) {
    handleError(error, res);
  }
});

app.delete('/characters/:id', async (req, res) => {
  const { id } = req.params;
  try {
    res.json(await deleteCharacter(id));
  } catch (error) {
    handleError(error, res);
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
