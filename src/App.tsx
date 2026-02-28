import { Toaster } from "@/modules/shared/components/ui/toaster";
import { Toaster as Sonner } from "@/modules/shared/components/ui/sonner";
import { TooltipProvider } from "@/modules/shared/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home, Rooms, RoomDetail, Services, Reservations, Reviews, Promociones, Login, InterestPlaces, StripeReturn, RefundPolicies, TermsAndConditions, FAQ } from "@/modules/client/pages";
import { AdminLayout, AdminReservas, AdminHabitaciones, AdminPromociones, AdminResenas, AdminSelector, GestionHome } from "@/modules/admin/pages";
import { NotFound, ProtectedRoute } from "@/modules/shared/components";
import { AuthProvider } from "@/modules/shared/context";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/habitaciones" element={<Rooms />} />
            <Route path="/habitaciones/:id" element={<RoomDetail />} />
            <Route path="/servicios" element={<Services />} />
            <Route path="/reservas" element={<Reservations />} />
            <Route path="/resenas" element={<Reviews />} />
            <Route path="/promociones" element={<Promociones />} />
            <Route path="/login" element={<Login />} />
            <Route path="/lugares-interes" element={<InterestPlaces />} />
            <Route path="/payment/success" element={<StripeReturn />} />
            <Route path="/politicas-reembolso" element={<RefundPolicies />} />
            <Route path="/terminos-condiciones" element={<TermsAndConditions />} />
            <Route path="/preguntas-frecuentes" element={<FAQ />} />
            <Route path="/admin-selector" element={<ProtectedRoute requireAdmin><AdminSelector /></ProtectedRoute>} />
            <Route path="/gestion" element={<ProtectedRoute requireAdmin><GestionHome /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminReservas />} />
              <Route path="habitaciones" element={<AdminHabitaciones />} />
              <Route path="promociones" element={<AdminPromociones />} />
              <Route path="resenas" element={<AdminResenas />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
