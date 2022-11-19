import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./Components/Auth/auth";
import Navbar from "./Components/navbar/navbar";
import { useGlobalContext } from "./context/context";
import Layout from "./Layout";
import Index from "./pages/Dashboard/dashboard";
import NotFound from "./pages/errors/notFound";
import {
  Categories,
  Users,
  Profile,
  Security,
  AddCategory,
  UpdateCategory,
  Products,
  AddProduct,
  UpdateProduct,
  Tasks,
  Contacts,
  Meetings,
  Login,
  Admins,
  AddAdmin,
  Pictures,
  Unauthorized,
  AddPicture,
  UpdatePicture,
  Messages,
} from "./tables/imp_exp";

const App = () => {
  const { size } = useGlobalContext();

  useEffect(() => {
    const container = document.querySelector(".container");
    size
      ? (container.style.height = window.innerHeight + "px")
      : (container.style.height = window.innerHeight - 40 + "px");
  }, [size]);

  useEffect(() => {
    console.log(
      "%c Hello to LM Dashboard Pro!",
      "font-weight: bold; font-size: 50px;color:#7A73B8; text-shadow: 3px 3px 0 #B0A7F0 , 6px 6px 0 #272864 , 9px 9px 0 #ff9cf2; margin-bottom: 12px; padding: 5%"
    );
    console.log(
      "%c moncef.lakehal@outlook.com",
      "font-weight: bold; font-size: 20px;background: linear-gradient(45deg,#bdc3c7,#2c3e50);color:#fff;margin: 1rem; padding: 3.5%"
    );
    console.log(
      "%c https://www.linkedin.com/in/moncef-lakehal-198020204/",
      "font-weight: bold; font-size: 20px;background: linear-gradient(45deg,#0a66c2,#ddd);color:#fff;margin: 1rem; padding: 3.5%"
    );
  }, []);
  return (
    <section className={`container ${size && "big-container"}`}>
      <Router>
        <Navbar />
        <Routes>
          <Route exacat path="/login" element={<Login />} />
          <Route exacat path="/Error/unauthorized" element={<Unauthorized />} />
          <Route exacat path="/Error/404" element={<NotFound />} />
          <Route element={<Layout />}>
            <Route exacat path="/" element={<Index />} />

            <Route
              element={<Auth roles={[+process.env.REACT_APP_ADMIN_KEY]} />}
            >
              <Route exacat path="/table/admins" element={<Admins />} />
              <Route exacat path="/table/admins/add" element={<AddAdmin />} />
            </Route>

            <Route
              element={
                <Auth
                  roles={[
                    +process.env.REACT_APP_VISITOR_KEY,
                    +process.env.REACT_APP_ADMIN_KEY,
                    +process.env.REACT_APP_MODERATOR_KEY,
                  ]}
                />
              }
            >
              <Route exacat path="/admin/profile" element={<Profile />} />
            </Route>

            <Route
              element={
                <Auth
                  roles={[
                    +process.env.REACT_APP_ADMIN_KEY,
                    +process.env.REACT_APP_MODERATOR_KEY,
                  ]}
                />
              }
            >
              <Route exacat path="/admin/security" element={<Security />} />

              <Route exacat path="/table/users" element={<Users />} />

              <Route exacat path="/table/categories" element={<Categories />} />
              <Route
                exacat
                path="/table/categories/update/:id"
                element={<UpdateCategory />}
              />
              <Route
                exacat
                path="/table/categories/add"
                element={<AddCategory />}
              />

              <Route exacat path="/table/products" element={<Products />} />
              <Route
                exacat
                path="/table/products/add"
                element={<AddProduct />}
              />
              <Route
                exacat
                path="/table/products/update/:id"
                element={<UpdateProduct />}
              />
              <Route
                exacat
                path="/table/products/addPicture/:id"
                element={<AddPicture />}
              />
              <Route
                exacat
                path="/table/products/pictures/:id"
                element={<Pictures />}
              />
              <Route
                exacat
                path="/table/products/pictures/update-picture/:id"
                element={<UpdatePicture />}
              />

              <Route exacat path="/table/contacts" element={<Contacts />} />

              <Route exacat path="/table/meetings" element={<Meetings />} />

              <Route exacat path="/table/messages" element={<Messages />} />

              <Route exacat path="/tasks" element={<Tasks />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        {/* <Foot /> */}
      </Router>
    </section>
  );
};

export default App;
