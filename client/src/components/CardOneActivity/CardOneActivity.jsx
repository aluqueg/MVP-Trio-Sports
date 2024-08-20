import React from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { BsTrophy, BsMap, BsClock } from "react-icons/bs";
import { Link } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

export const CardOneActivity = ({
  activity,
  handleJoinActivity,
  isActivityFull,
  isActivityPast,
  getButtonLabel,
  getStatusLabel,
}) => {
  const activityDate = parseISO(activity.date_time_activity);
  const formattedDate = format(activityDate, "dd/MM/yyyy HH:mm", {
    locale: es,
  });
  const statusLabel = getStatusLabel(activity);

  return (
    <Col xs={12} md={6} className="mb-4">
      <Link
        to={`/activity/${activity.activity_id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <Card className="flex-column flex-md-row h-100">
          <Card.Img
            src={`/src/assets/activities/${activity.sport_img}`}
            alt={activity.text}
            className="card-img-custom"
            onError={(e) =>
              (e.target.src = "/src/assets/activities/newsport.jpg")
            }
          />

          <Card.Body className="d-flex flex-column">
            {activity.text && <Card.Title>{activity.text}</Card.Title>}

            <Card.Text>
              <BsTrophy /> {activity.sport_name}
            </Card.Text>

            <Card.Text>
              <BsClock /> {formattedDate}
            </Card.Text>

            <Card.Text>
              <BsMap /> {activity.activity_address}, {activity.activity_city}
            </Card.Text>

            {statusLabel && (
              <Card.Text
                className={
                  statusLabel === "Completa" ? "text-danger" : "text-muted"
                }
              >
                <strong>{statusLabel}</strong>
              </Card.Text>
            )}

         
            <div style={{ flexGrow: 1 }}></div>

            {/* Contenedor para los botones */}
            <Row className="mt-3">
              <Col xs={12} md={6} className="mb-2 mb-md-0">
                <Button
                  variant={
                    isActivityFull(activity) || isActivityPast(activityDate)
                      ? "danger"
                      : "primary"
                  }
                  className="w-100"
                  disabled={
                    isActivityFull(activity) || isActivityPast(activityDate)
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    handleJoinActivity(activity.activity_id);
                  }}
                >
                  {getButtonLabel(activity)}
                </Button>
              </Col>
              <Col xs={12} md={6}>
                <Button variant="secondary" className="w-100">
                  Añadir comentario
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Link>
    </Col>
  );
};
