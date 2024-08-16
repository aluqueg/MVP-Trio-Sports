const connection = require("../config/db");

class ActivityController {
  createActivity = (req, res) => {
    const {
      date_time_activity,
      limit_users,
      text,
      activity_city,
      details,
      sport_id,
      user_id,
      maps_link
    } = req.body;

    // Validación de campos obligatorios
    if (!date_time_activity || !text || !activity_city || !sport_id || !user_id) {
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

    // Validación de formato de la ciudad (solo letras y espacios)
    const cityPattern = /^[a-zA-Z\s]+$/;
    if (!cityPattern.test(activity_city)) {
      return res.status(400).json({ error: "El nombre de la ciudad contiene caracteres inválidos." });
    }

    // Validación de texto de la actividad (longitud máxima)
    if (text.length > 255) {
      return res.status(400).json({ error: "La descripción de la actividad no puede tener más de 255 caracteres." });
    }

    // Validación de límite de usuarios (debe ser un número positivo o nulo)
    if (limit_users !== null && limit_users <= 1) { // Cambiado a 1 para asegurar al menos 2 jugadores
      return res.status(400).json({ error: "El límite de usuarios debe ser al menos 2." });
    }

    // Convertir el campo 'text' a minúsculas y luego hacer que la primera letra sea mayúscula
    let formattedText = text.toLowerCase();
    formattedText = formattedText.charAt(0).toUpperCase() + formattedText.slice(1);

    // Validación de actividad duplicada (misma fecha, ciudad y deporte)
    const sqlCheckDuplicate = `SELECT * FROM activity WHERE date_time_activity = ? AND activity_city = ? AND sport_id = ?`;
    connection.query(sqlCheckDuplicate, [date_time_activity, activity_city, sport_id], (err, result) => {
      if (err) {
        console.error("Error al verificar actividad duplicada:", err);
        return res.status(500).json({ error: "Error al verificar actividad duplicada." });
      }

      if (result.length > 0) {
        return res.status(400).json({ error: "Ya existe una actividad similar programada en la misma fecha y lugar." });
      }

      // Crear la nueva actividad en la base de datos
      const sql = `INSERT INTO activity (date_time_activity, limit_users, text, activity_city, details, sport_id, user_id, maps_link) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
      const values = [date_time_activity, limit_users || null, formattedText, activity_city, details, sport_id, user_id, maps_link || null];

      connection.query(sql, values, (err, result) => {
        if (err) {
          console.error("Error al crear la actividad:", err);
          return res.status(500).json({ error: "Error al crear la actividad." });
        }

        res.status(201).json({ message: "Actividad creada con éxito", activity_id: result.insertId });
      });
    });
  };

  editActivity = (req, res) => {
    res.send("editActivity");
  };

  getAllActivities = (req, res) => {
    const sql = `
      SELECT a.activity_id, a.date_time_activity, a.limit_users, a.text, a.activity_city, 
             a.details, a.maps_link, s.sport_name, s.sport_img
      FROM activity a
      JOIN sport s ON a.sport_id = s.sport_id
      ORDER BY a.date_time_activity DESC`;

    connection.query(sql, (error, results) => {
      if (error) {
        console.error("Error al obtener las actividades:", error);
        return res.status(500).json({ error: "Error al obtener las actividades" });
      }

      res.status(200).json(results);
    });
  };

  getOneActivity = (req, res) => {
    res.send("getOneActivity");
  };
}

module.exports = new ActivityController();


