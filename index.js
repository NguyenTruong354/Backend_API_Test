const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const challengeRoutes = require('./routes/challengeRoutes');
const memberChallengesRoutes = require('./routes/memberChallengesRoutes');
const swaggerUi = require('swagger-ui-express');
const yaml = require('js-yaml');
const fs = require('fs');

require('dotenv').config();

const app = express();

// Load OpenAPI specification
const openApiSpec = yaml.load(fs.readFileSync('./docs/openapi.yaml', 'utf8'));

// Serve Swagger UI at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

app.get('/', (req, res) => res.send('Hello World!'));
app.use('/api/challenges', challengeRoutes);
app.use('/api/member-challenges', memberChallengesRoutes);

// Sync Sequelize models with database
sequelize.sync({ force: false }).then(() => {
  app.listen(port, () => console.log(`Server running on port ${port}`));
}).catch(err => console.error('Database sync error:', err));