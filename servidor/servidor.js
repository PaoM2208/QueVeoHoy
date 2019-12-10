//paquetes necesarios para el proyecto
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const controller = require('./controladores/controller');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.get('/peliculas', controller.lookforMovie);
app.get('/generos', controller.lookforGender);
app.get('/peliculas/:id', controller.infoMovie);
app.get('/peliculas/recomendacion', controller.suggestMovie);

//seteamos el puerto en el cual va a escuchar los pedidos la aplicación
const puerto = '8080';

app.listen(puerto, function () {
  console.log( "Escuchando en el puerto " + puerto);
});