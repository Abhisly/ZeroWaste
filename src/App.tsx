/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RestaurantDashboard from './pages/RestaurantDashboard';
import NgoDashboard from './pages/NgoDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LiveDeliveryPage from './pages/LiveDeliveryPage';
import AgentsDashboard from './pages/AgentsDashboard';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login/:portal" element={<LoginPage />} />
        <Route path="/register/:portal" element={<RegisterPage />} />
        <Route path="/dashboard/restaurant" element={<RestaurantDashboard />} />
        <Route path="/dashboard/ngo" element={<NgoDashboard />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/dashboard/agent/:role?" element={<AgentsDashboard />} />
        <Route path="/delivery/:id" element={<LiveDeliveryPage />} />
      </Routes>
    </Router>
  );
}
