import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useGlobalContext } from "./context/context";
import numbeRange from "./function/numberRange";

const Layout = () => {
  const { setIsHeInBottom, isMenuOpen, haveAccess } = useGlobalContext();
  const location = useLocation();
  const { pathname } = useLocation();

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    // console.log(scrollTop,clientHeight,scrollHeight,Math.floor(scrollHeight - scrollTop));
    const range=numbeRange(clientHeight-30,clientHeight+30);
    // console.log(range.includes(scrollHeight - scrollTop));
    range.includes(scrollHeight - scrollTop) ? setIsHeInBottom(true) : setIsHeInBottom(false);
  }

  useEffect(() => {
    document.querySelector('.index')?.scrollTo(0, 0);
  }, [pathname])


  return (
    haveAccess ? <section className={`index ${isMenuOpen && 'big-index'}`} onScroll={handleScroll}>
      <Outlet />
    </section>
      : <Navigate to='/login' state={{ from: location }} replace />
  );
}

export default Layout;
