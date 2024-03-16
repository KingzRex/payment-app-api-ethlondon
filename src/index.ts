import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
dotenv.config();
import cors from 'cors';
import CookieParser from 'cookie-parser'
import { OK } from './Resources/Constants/StatusCodes';
import corsOptions from './Resources/Cors/CorsOption';
const app: Express = express();
import { apiRoutes } from './Routes/index';


app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(CookieParser());


app.get("/", async (_, res) => {
    res.status(OK).send("Welcome to Payment API :)");
});

app.use('/api', apiRoutes);

app.all('*', (req: Request, res: Response) => {
    res.status(404).json({
        message: "Invalid Api Endpoint"
    });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`🚀 Server ready at: http://localhost:${PORT}`);
});


module.exports = app;


