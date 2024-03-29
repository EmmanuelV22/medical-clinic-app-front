/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import NotificationsButtonsRead from "../NotificationsButtonsRead";

const NotificationAppointment = () => {
  const { store, actions } = useContext(Context);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  let navigate = useNavigate();

  const handleNotificationEmployee = async (patientId) => {
    try {
      const patientDetails = await actions.getEmployeeById(patientId);
      navigate(`/notifications/${patientId}`);
    } catch (error) {
      console.error("Error recupernado la informacion del paciente", error);
    }
  };

  const getNotifications = async () => {
    await actions.getNotifications();
    const filteredNotifications = store.notifications.filter(
      (notification) =>
        notification.state === "no leído" &&
        notification.medical_id === store.employee.id &&
        notification.appointment_message_employee !== null &&
        store.employee
    );
    setUnreadNotifications(filteredNotifications);
  };
  useEffect(() => {
    getNotifications();
  }, []);

  return (
    <div className=" ">
      <ul
        className="dropdown-menu dropdown dropdown-toggle-split ul"
        aria-labelledby="navbarDropdown"
      >
        {unreadNotifications && unreadNotifications.length > 0 ? (
          <>
            {unreadNotifications
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .slice(0, 10)
              .map(
                (notification, index) =>
                  notification.appointment_message_employee && (
                    <li key={notification.id} className="dropdown-item d-flex">
                      <span style={{ cursor: "default" }}>
                        {notification.appointment_message_employee}
                      </span>
                      <NotificationsButtonsRead notification={notification} />
                    </li>
                  )
              )}

            <hr />
            <li
              className="text-center dropdown-item"
              onClick={() => handleNotificationEmployee(store.employee.id)}
            >
              <h5>Ver todas mis notificaciones</h5>
            </li>
          </>
        ) : (
          <>
            <li className="dropdown-item">¡No tienes notificaciones!</li>
            <div>
              <li>
                {" "}
                <Link
                  onClick={() => handleNotificationEmployee(store.employee.id)}
                >
                  Ver todas mis notificaciones
                </Link>
              </li>
            </div>
          </>
        )}
      </ul>
    </div>
  );
};

export default NotificationAppointment;
