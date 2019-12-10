CREATE DATABASE que_veo_hoy;
CREATE TABLE pelicula(
    id int not null auto_increment,
    titulo varchar(100),
    duracion int(5),
    director varchar(400),
    anio int(5),
    fecha_lanzamiento DATE,
    puntuacion int(2),
    poster VARCHAR(300),
    trama VARCHAR(700),
    primary key(id)
);
CREATE TABLE genero(
    id int not null auto_increment,
    nombre VARCHAR(30),
    primary key(id)
);

CREATE TABLE actor(
  id int NOT NULL AUTO_INCREMENT,
  nombre varchar(50),
  PRIMARY KEY (id)
);

CREATE TABLE actor_pelicula(
  id int NOT NULL AUTO_INCREMENT,
  actor_id int NOT NULL,
  pelicula_id int NOT NULL,
  PRIMARY KEY (id),
  KEY ap_actor_id (actor_id),
  KEY ap_pelicula_id (pelicula_id),
  CONSTRAINT ap_actor_id FOREIGN KEY (actor_id) REFERENCES actor (id),
  CONSTRAINT ap_pelicula_id FOREIGN KEY (pelicula_id) REFERENCES pelicula (id)
);

ALTER TABLE pelicula ADD COLUMN (genero_id int not null);
ALTER TABLE pelicula ADD CONSTRAINT FK_PELICULA_GENERO FOREIGN KEY (genero_id) REFERENCES genero(id);
