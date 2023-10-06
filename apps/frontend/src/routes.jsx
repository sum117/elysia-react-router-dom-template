import { Outlet, Route, createRoutesFromElements } from "react-router-dom";

export const routes = createRoutesFromElements(
  <Route path="/website" element={<Outlet />}>
    <Route path="about" element={<div>About</div>} />
    <Route path="contact" element={<div>Contact</div>} />
  </Route>,
);
