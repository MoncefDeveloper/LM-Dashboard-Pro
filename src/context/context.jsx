import axios from "axios";
import React, { createContext, useContext, useState, useEffect } from "react";
export const DashboardProvider = createContext();

const DashboardContext = ({ children }) => {
  const [size, setSize] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHeInBottom, setIsHeInBottom] = useState(false);
  const [haveAccess, setHaveAccess] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [pathname, setPathname] = useState("/");

  useEffect(() => {
    const getAdmin = () => {
      if (!admin) {
        const myData = new FormData();
        myData.append(
          "api_password",
          "sskPTvYSaTYacyDRwbwnWqc1KN1g7frlq03IcCvyQ58gWFUo"
        );
        try {
          axios
            .post(process.env.REACT_APP_API_URL + "api/profile", myData, {
              withCredentials: true,
            })
            .then((data) => {
              if (data.data.status) {
                setAdmin(data.data.admin);
              }
            });
        } catch (error) {
          console.log(error);
        }
      }
    };
    getAdmin();
  }, [admin]);

  const getCookie = (name) => {
    var match = document.cookie.match(
      RegExp("(?:^|;\\s*)" + name + "=([^;]*)")
    );
    return match ? match[1] : null;
  };

  useEffect(() => {
    setHaveAccess(getCookie("haveAccess") ? true : false);
  }, [pathname]);

  return (
    <DashboardProvider.Provider
      value={{
        size,
        isMenuOpen,
        isHeInBottom,
        haveAccess,
        admin,
        setSize,
        setIsMenuOpen,
        setIsHeInBottom,
        setHaveAccess,
        setAdmin,
        setPathname,
        getCookie,
      }}
    >
      {children}
    </DashboardProvider.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(DashboardProvider);
};

export default DashboardContext;
