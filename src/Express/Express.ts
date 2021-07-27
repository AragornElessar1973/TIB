import { Client } from "discord.js";
import express from "express"
import cors from "cors";
import { Express_Port, Express_Session_Secret } from "../Config";
import Oauth2Router from "./Routers/Oauth2";
import session from "express-session";
import OAuth2 from "./Struct/Oauth2";

declare module "express-session"
{
    interface SessionData {
        discord_token?: string;
    }
}

export default class ExpressClient
{
    private server = express();
    private client: Client;
    private oauth: OAuth2;

    constructor(client: Client)
    {
        this.client = client;
        this.oauth = new OAuth2(this.client);

        this.server.use(cors({
            origin: true,
            credentials: true
        }));

        let sessionMiddleWare = session({
            secret: Express_Session_Secret ?? "",
            resave: false,
            saveUninitialized: true,
            cookie: {
                path: "/",
                maxAge: 24*60*60*1000,
            }
        });

        this.server.use(sessionMiddleWare);

        this.server.use(express.urlencoded({ extended: true }));

        this.server.use((req, res, next) => {
            res.setHeader('X-Powered-By', 'Tolfix');

            next();
        });

        new Oauth2Router(this.server, this.client, this.oauth);

        this.server.listen(Express_Port);
    }
}