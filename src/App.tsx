import { Toaster } from "@/modules/shared/components/ui/toaster";
import { Toaster as Sonner } from "@/modules/shared/components/ui/sonner";
import { TooltipProvider } from "@/modules/shared/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Index, Rooms, RoomDetail, Services, Reservations, Login } from "@/modules/client/pages";
import { AdminLayout, AdminReservas, AdminHabitaciones, AdminPromociones, AdminResenas } from "@/modules/admin/pages";
import { NotFound } from "@/modules/shared/components";

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
