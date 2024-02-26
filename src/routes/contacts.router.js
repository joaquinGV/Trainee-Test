import { Router } from "express";
import { Client } from "@hubspot/api-client";
import dotenv from "dotenv";
dotenv.config();

const router = Router();
const API_KEY = process.env.API_KEY;
const URL = process.env.URL;
const accessToken = `Bearer ${API_KEY}`;
const hubspotClient = new Client({
  accessToken: API_KEY,
});

//Obtener Todos los contactos
router.get("/", async (req, res) => {
  /* #swagger.tags= ['Contacts'] 
    #swagger.description = "Get all contacts service" 
    #swagger.responses[200] ={
      schema:{$ref: "#/definitions/Contacts"}, description: "Get all users"
    }
    */
  try {
    const response = await fetch(URL, {
      method: "GET",
      headers: {
        Authorization: accessToken,
        "Content-Type": "application/json",
      },
    });

    const responseData = await response.json();
    res.json(responseData);
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

//Obtener contacto en especifico por ID
// router.get("/:cid", async (req, res) => {
//   const { cid } = req.params;
//   try {
//     const response = await fetch(`${URL}/${cid}`, {
//       method: "GET",
//       headers: {
//         Authorization: accessToken,
//         "Content-Type": "application/json",
//       },
//     });

//     const responseData = await response.json();
//     res.json(responseData);
//   } catch (error) {
//     res.status(500).send({ status: "error", message: error.message });
//   }
// });

//Obtener contacto en especifico por EMAIL con libreria
router.get("/:mail", async (req, res) => {
  /* #swagger.tags= ['Contacts'] 
    #swagger.description = "Get contact that match email" 
        #swagger.responses[200] ={
      schema:{$ref: "#/definitions/Contacts"}, description: "Get user that contains email"
    }
    */
  try {
    const { mail } = req.params;

    const ObjectSearchRequest = {
      filterGroups: [
        {
          filters: [
            {
              propertyName: "email",
              operator: "CONTAINS",
              value: `${mail}`,
            },
          ],
        },
      ],
      sorts: [{ propertyName: "email", direction: "DESCENDING" }],
    };

    hubspotClient.crm.contacts.searchApi
      .doSearch(ObjectSearchRequest)
      .then((results) => {
        // console.log(results);
        res.json(results);
      })
      .catch((err) => {
        res.status(400).json({ error: err.message });
        console.error(err);
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Crear contacto nuevo con Libreria en base a body proporcionado.
router.post("/", async (req, res) => {
  /* #swagger.tags= ['Contacts'] 
    #swagger.description = "POST a new contact service" 
        #swagger.responses[200] ={
      schema:{$ref: "#/definitions/Contacts"}, description: "Post a new Contact"
    }
    */
  try {
    const { email, firstname, lastname, phone } = req.body;

    if (!email || !firstname || !lastname || !phone) {
      res.status(400).json({ error: "Body con campos incompletos" });
    }

    const newBody = {
      properties: {
        email,
        firstname,
        lastname,
        phone,
      },
    };

    hubspotClient.crm.contacts.basicApi
      .create(newBody)
      .then((results) => {
        console.log(results);
        res.json(results);
      })
      .catch((err) => {
        res.status(400).json({ error: err.message });
        console.error(err);
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Actualizar información de contacto en base a contact ID y body proporcionado.
router.patch("/:cid", async (req, res) => {
  /* #swagger.tags= ['Contacts'] 
    #swagger.description = "PATCH a contact by ID service" 
    #swagger.responses[200] ={
      schema:{$ref: "#/definitions/Contacts"}, description: "Update contact data that match id "
    }
    */
  try {
    const { cid } = req.params;

    const { email, firstname, lastname, phone } = req.body;

    if (!email && !firstname && !lastname && !phone) {
      res.status(400).json({ error: "Body con campos incompletos" });
    }

    const newBody = {
      properties: {
        ...req.body,
      },
    };

    const response = await fetch(`${URL}/${cid}`, {
      method: "PATCH",
      headers: {
        Authorization: accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newBody),
    });

    const responseData = await response.json();
    res.json(responseData);
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

// Delete contact via contact ID.
router.delete("/:cid", async (req, res) => {
  /* #swagger.tags= ['Contacts'] 
    #swagger.description = "Delete a contact by ID service" 
    #swagger.responses[200] ={
       description: "Delete a Contact"
    }
    */
  try {
    const { cid } = req.params;

    const response = await fetch(`${URL}/${cid}`, {
      method: "DELETE",
      headers: {
        Authorization: accessToken,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      console.log("Contacto eliminado correctamente");
      res
        .status(200)
        .send({ payload: `Contacto con id:${cid} borrado exitosamente` });
    } else {
      res.status(400).send({
        status: "error",
        message: `Error borrando el contacto ${cid}`,
      });
    }
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

export default router;
