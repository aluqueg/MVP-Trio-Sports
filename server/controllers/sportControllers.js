const connection = require("../config/db");

class SportController {
  createSport = (req, res) => {
    let { sport_name } = req.body;

    // 1.- Convertir el nombre del deporte a minúsculas
    sport_name = sport_name.toLowerCase();

    const sport_img = "newsport.jpg";

    //console.log("Nombre del deporte recibido:", sport_name);  Verificar el valor recibido

    // 2.- Comprobar si ya existe un deporte (en minúsculas)
    let sql = `SELECT * FROM sport WHERE sport_name = ?`;
    connection.query(sql, [sport_name], (error, result) => {
      if (error) {
        console.log("Error en la consulta de verificación:", error); // Depurar errores
        return res.status(500).json({ error: "Error al verificar deporte" });
      }

      //console.log("Resultado de la consulta de verificación:", result); Verificar resultado

      if (result.length !== 0) {
        console.log("El deporte ya existe"); // Depurar si ya existe
        return res.status(401).json("El deporte ya existe");
      }

      // 3.- Insertar un deporte con la imagen por defecto
      let sql2 = `INSERT INTO sport (sport_name, sport_img) VALUES (?, ?)`;
      connection.query(sql2, [sport_name, sport_img], (errIns, result2) => {
        if (errIns) {
          //console.log("Error en la inserción:", errIns); // Depurar errores de inserción
          return res.status(500).json({ error: "Error al insertar deporte" });
        }

        //console.log("Deporte insertado correctamente:", result2); // Verificar inserción exitosa
        return res.status(201).json({
          sport_id: result2.insertId,
          sport_name: sport_name,
          sport_img: sport_img,
        });
      });
    });
  };
}

module.exports = new SportController();
