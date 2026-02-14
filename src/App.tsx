import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Rooms from "./pages/Rooms";
import RoomDetail from "./pages/RoomDetail";
import Services from "./pages/Services";
import Reservations from "./pages/Reservations";
import Login from "./pages/Login";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminReservas from "./pages/admin/AdminReservas";
import AdminHabitaciones from "./pages/admin/AdminHabitaciones";
import AdminPromociones from "./pages/admin/AdminPromociones";
import AdminResenas from "./pages/admin/AdminResenas";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/habitaciones" element={<Rooms />} />
          <Route path="/habitaciones/:id" element={<RoomDetail />} />
          <Route path="/servicios" element={<Services />} />
          <Route path="/reservas" element={<Reservations />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminReservas />} />
            <Route path="habitaciones" element={<AdminHabitaciones />} />
            <Route path="promociones" element={<AdminPromociones />} />
            <Route path="resenas" element={<AdminResenas />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
