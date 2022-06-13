import { Component } from "solid-js";
import { lazy } from "solid-js";

import { Router, Routes, Route } from "solid-app-router";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import About from "./pages/About";
import RestClientIndex from "./pages/RestClient";
import { fetchSelectedRequest } from "./pages/RestClient/[id]";
const RestClient = lazy(() => import("./pages/RestClient/[id]"));

const App: Component = () => {
  return (
    <Router>
      <Navbar></Navbar>
      <main class="px-8 py-4">
        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/" element={<Home />}>
            <Route path="/" element={<RestClientIndex />} />
            <Route
              path="/:id"
              element={<RestClient />}
              data={fetchSelectedRequest}
            />
          </Route>
        </Routes>
      </main>
    </Router>
  );
};

export default App;
