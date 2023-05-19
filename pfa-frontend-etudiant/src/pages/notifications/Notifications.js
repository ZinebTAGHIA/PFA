import React, { useEffect, useState } from "react";
import "./notifications.css";
import { Link } from "react-router-dom";
import axios from "../../api/axios";
import { ProgressSpinner } from "primereact/progressspinner";


const Notifications = ({ user }) => {
  const [notifs, setNotifs] = useState();
  const [nbrNotif, setNbrNotif] = useState(0);
  useEffect(() => {
    axios
      .get(`/api/notifications/${user.id}`)
      .then((response) => {
        setNotifs(response.data.data);
        setNbrNotif(
          response.data.data.filter((element) => element.is_read === false)
            .length
        );
      })
      .catch((error) => console.error(error));

    const unReadMessages = document.querySelectorAll(".unread");
    const unReadMessagesCount = document.getElementById("num-of-notif");
    const markAll = document.getElementById("mark-as-read");

    unReadMessagesCount.innerText = unReadMessages.length;
  }, []);


  const onUnreadMsgClick = (e, id) => {
    e.currentTarget.classList.remove("unread");
    const newUnreadMessages = document.querySelectorAll(".unread");
    // const unReadMessagesCount = document.getElementById("num-of-notif");
    // unReadMessagesCount.innerText = newUnreadMessages.length;
    setNbrNotif(nbrNotif - 1);
    axios
      .put(`/api/notif/${id}`)
      .then((response) => console.log(response.data))
      .catch((error) => console.error(error));
  };

  const handleParagraphClick = (e) => {
    const containerDiv = e.currentTarget.closest(".notificationCard");
    onUnreadMsgClick({ currentTarget: containerDiv }); // Call the handleClick function with the specific container div as the currentTarget
  };
  return (
    <main>
      {!notifs ? <ProgressSpinner /> : <></>}
      <h1 className="title">Notifications</h1>
      <ul className="breadcrumbs">
        <li>
          <Link to="/">Accueil</Link>
        </li>
        <li className="divider">/</li>
        <li>
          <a href="#" className="active">
            Notifications
          </a>
        </li>
      </ul>
      <div className="container">
        <div className="notificationContainer">
          <header>
            <div className="notificationHeader">
              <h1>Notifications</h1>
              <span id="num-of-notif">{nbrNotif}</span>
            </div>
          </header>
          <main>
            {notifs &&
              notifs.map((element) => {
                return (
                  <div
                    key={element.id}
                    className={
                      element.is_read
                        ? "notificationCard"
                        : "notificationCard unread"
                    }
                    onClick={(e) => onUnreadMsgClick(e, element.id)}
                  >
                    <div className="description">
                      <p onClick={handleParagraphClick}>{element.content}</p>
                      <p className="notif-time">{element.date_notif}</p>
                    </div>
                  </div>
                );
              })}
          </main>
        </div>
      </div>
    </main>
  );
};

export default Notifications;
