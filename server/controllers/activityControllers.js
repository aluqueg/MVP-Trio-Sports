const connection = require("../config/db");

class ActivityController {
  createActivity = (req, res) => {
    const {
      date_time_activity,
      limit_users,
      text,
      activity_city,
      activity_address,
      details,
      sport_id,
      user_id,
      maps_link,
    } = req.body;

    // Validación de campos obligatorios
    if (!date_time_activity || !text || !activity_city || !activity_address || !sport_id || !user_id) {
      return res.status(400).json({ error: "Todos los campos obligatorios deben completarse." });
    }

    // Validación de fecha y hora (debe ser futura)
    const currentDateTime = new Date();
    const activityDateTime = new Date(date_time_activity);

    if (activityDateTime <= currentDateTime) {
      return res.status(400).json({ error: "La fecha y hora de la actividad deben ser en el futuro." });
    }

    // Validación de longitud de la ciudad
    if (activity_city.length > 50) {
      return res.status(400).json({ error: "El nombre de la ciudad no puede tener más de 50 caracteres." });
    }

    // Validación de formato de la ciudad (solo letras, acentos y espacios)
    const cityPattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!cityPattern.test(activity_city)) {
      return res.status(400).json({ error: "El nombre de la ciudad contiene caracteres inválidos." });
    }

    // Validación de texto de la actividad (longitud máxima)
    if (text.length > 255) {
      return res.status(400).json({ error: "La descripción de la actividad no puede tener más de 255 caracteres." });
    }

    // Validación de límite de usuarios (debe ser un número positivo o nulo)
    if (limit_users !== null && limit_users <= 1) {
      return res.status(400).json({ error: "El límite de usuarios debe ser al menos 2." });
    }

    // Validación de dirección (longitud máxima y no vacía)
    if (activity_address.length > 250) {
      return res.status(400).json({ error: "La dirección no puede tener más de 250 caracteres." });
    }

    // Validación del enlace de Google Maps (solo URL válida)
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    if (maps_link && !urlPattern.test(maps_link)) {
      return res.status(400).json({ error: "El enlace de Google Maps no es válido." });
    }

    // Formatear texto (solo la primera letra en mayúscula)
    const formatText = (str) => {
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    let formattedText = formatText(text);
    let formattedCity = formatText(activity_city);
    let formattedAddress = formatText(activity_address);

    // Validación de actividad duplicada (misma fecha, ciudad y deporte)
    const sqlCheckDuplicate = `SELECT * FROM activity WHERE date_time_activity = ? AND activity_city = ? AND sport_id = ?`;
    connection.query(sqlCheckDuplicate, [date_time_activity, formattedCity, sport_id], (err, result) => {
      if (err) {
        console.error("Error al verificar actividad duplicada:", err);
        return res.status(500).json({ error: "Error al verificar actividad duplicada." });
      }

      if (result.length > 0) {
        return res.status(400).json({ error: "Ya existe una actividad similar programada en la misma fecha y lugar." });
      }

      // Crear la nueva actividad en la base de datos
      const sql = `INSERT INTO activity (date_time_activity, limit_users, text, activity_city, activity_address, details, sport_id, user_id, maps_link) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const values = [date_time_activity, limit_users || null, formattedText, formattedCity, formattedAddress, details, sport_id, user_id, maps_link || null];

      connection.query(sql, values, (err, result) => {
        if (err) {
          console.error("Error al crear la actividad:", err);
          return res.status(500).json({ error: "Error al crear la actividad." });
        }

        res.status(201).json({ message: "Actividad creada con éxito", activity_id: result.insertId });
      });
    });
  };

  joinActivity = (req, res) => {
    const { activity_id } = req.body;

    const sqlGetActivity = `SELECT limit_users, num_assistants FROM activity WHERE activity_id = ?`;
    connection.query(sqlGetActivity, [activity_id], (err, results) => {
      if (err) {
        console.error("Error al obtener la actividad:", err);
        return res.status(500).json({ error: "Error al obtener la actividad." });
      }

      const { limit_users, num_assistants } = results[0];

      if (limit_users && num_assistants >= limit_users) {
        return res.status(400).json({ error: "La actividad ya está completa." });
      }

      const sqlUpdateAssistants = `UPDATE activity SET num_assistants = num_assistants + 1 WHERE activity_id = ?`;
      connection.query(sqlUpdateAssistants, [activity_id], (err, result) => {
        if (err) {
          console.error("Error al actualizar la actividad:", err);
          return res.status(500).json({ error: "Error al unirse a la actividad." });
        }
        res.status(200).json({ message: "Te has unido a la actividad." });
      });
    });
  };

  getAllActivities = (req, res) => {
    const sql = `
      SELECT a.activity_id, a.date_time_activity, a.limit_users, a.text, a.activity_city, 
             a.activity_address, a.details, a.maps_link, a.num_assistants, s.sport_name, s.sport_img,
             CASE
               WHEN a.date_time_activity >= NOW() THEN 0
               ELSE 1
             END AS is_past
      FROM activity a
      JOIN sport s ON a.sport_id = s.sport_id
      ORDER BY is_past ASC, a.date_time_activity ASC`;  // Mostrar primero las actividades futuras y luego las finalizadas.
  
    connection.query(sql, (error, results) => {
      if (error) {
        console.error("Error al obtener las actividades:", error);
        return res.status(500).json({ error: "Error al obtener las actividades" });
      }
      console.log(results); 
      res.status(200).json(results);
    });
  };
  

  getOneActivity = (req, res) => {
    res.send("getOneActivity");
  };

  editActivity = (req, res) => {
    res.send("getOneActivity");
  };


}

module.exports = new ActivityController();





