import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    version: "1.0.0",
    title: "Documentación generada con Middleware a Hubspot",
    description: "Documentación proyecto de Contactos Trainee",
  },
  host: "trainee.up.railway.app",
  basePath: "/",
  schemes: ["http"],
  definitions: {
    Contacts: {
      result: {
        firstname: "Api",
        lastname: "Testing",
        email: "Traine@b&o.com",
        phone: 5551234567,
      },
    },
  },
};

const outputFile = "./swagger-output.json";
const endPointsFiles = ["./src/app.js"];

swaggerAutogen(outputFile, endPointsFiles, doc).then(async () => {
  await import("./src/app.js");
});
