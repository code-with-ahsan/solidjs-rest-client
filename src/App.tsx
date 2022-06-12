import { Component, createSignal } from 'solid-js';
import { lazy } from 'solid-js';

import styles from './App.module.css';
import { Router, Routes, Route, Link, Outlet } from "solid-app-router";
import Home from './pages/Home';
import Navbar from './components/Navbar';
import About from './pages/About';
import RestClientIndex from './pages/RestClient';
import { IRestRequest } from './interfaces/rest.interfaces';
import { fetchSelectedRequest } from './pages/RestClient/[id]';

const RestClient = lazy(() => import("./pages/RestClient/[id]"));

export const [restRequests, setRestRequests] = createSignal<IRestRequest[]>([{
  id: '1',
  name: 'Get Scores',
  description: 'Getting scores from server',
  request: {
    method: 'GET',
    url: 'https://scorer-pro-backend.herokuapp.com/score/game123',
  }
}, {
  id: '2',
  name: 'Add Score',
  description: 'Adding scores to server',
  request: {
    method: 'POST',
    url: 'https://scorer-pro-backend.herokuapp.com/score',
  }
}]);

export const [selectedRequest, setSelectedRequest] = createSignal<IRestRequest | null>(null);

const App: Component = () => {
  return (
    <Router>
      <Navbar></Navbar>
      <main class="px-4 py-2">
        <Routes>
          <Route path="/about" element={<About/>} />
          <Route path="/" element={<Home />}>
            <Route path="/" element={<RestClientIndex/>} />
            <Route path="/:id" element={<RestClient/>} data={fetchSelectedRequest} />
          </Route>
        </Routes>
      </main>
    </Router>
  );
};

export default App;
