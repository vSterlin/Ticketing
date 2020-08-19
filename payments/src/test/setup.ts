import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import  jwt  from 'jsonwebtoken';
import { app } from "../app";
import  request from "supertest";

declare global {
  namespace NodeJS {
    interface Global {
      signin(id?: string): string[];
    }
  }
}

jest.mock("../nats-wrapper.ts");

process.env.STRIPE_KEY = "sk_test_51HGEarIKlAP98jv64DgHoprhExPLRaEhJz4oQ3te5yIY8vIgHKoC1BViWoXKIDNkC761NWOjDCXafDSvc8YWfX5500IJ8Gk5UA";

let mongo: any;
beforeAll(async () => {

  process.env.JWT_KEY = "asdfg";
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = (id?: string) => {
  //Build a JWT payload
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com"
  };

  //Create JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  //Build session Object
  const session = { jwt: token };

  //Turn session into JSON
  const sessionJSON = JSON.stringify(session);

  //Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  //return cookie
  return [`express:sess=${base64}`];
}