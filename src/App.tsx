import { Toaster } from "@/modules/shared/components/ui/toaster";
import { Toaster as Sonner } from "@/modules/shared/components/ui/sonner";
import { TooltipProvider } from "@/modules/shared/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { lazy, Suspense } from "react";
import { NotFound, ProtectedRoute } from "@/modules/shared/components";
import { AuthProvider } from "@/modules/shared/context";

// Code-splitting: cargar páginas bajo demanda
const Home = lazy(() => import("@/modules/client/pages").then(m => ({ default: m.Home })));
const Rooms = lazy(() => import("@/modules/client/pages").then(m => ({ default: m.Rooms })));
const RoomDetail = lazy(() => import("@/modules/client/pages").then(m => ({ default: m.RoomDetail })));
const Services = lazy(() => import("@/modules/client/pages").then(m => ({ default: m.Services })));
const Reservations = lazy(() => import("@/modules/client/pages").then(m => ({ default: m.Reservations })));
const Reviews = lazy(() => import("@/modules/client/pages").then(m => ({ default: m.Reviews })));
const Promociones = lazy(() => import("@/modules/client/pages").then(m => ({ default: m.Promociones })));
const Login = lazy(() => import("@/modules/client/pages").then(m => ({ default: m.Login })));
const InterestPlaces = lazy(() => import("@/modules/client/pages").then(m => ({ default: m.InterestPlaces })));
const StripeReturn = lazy(() => import("@/modules/client/pages").then(m => ({ default: m.StripeReturn })));
const RefundPolicies = lazy(() => import("@/modules/client/pages").then(m => ({ default: m.RefundPolicies })));
const TermsAndConditions = lazy(() => import("@/modules/client/pages").then(m => ({ default: m.TermsAndConditions })));
const FAQ = lazy(() => import("@/modules/client/pages").then(m => ({ default: m.FAQ })));

// Admin pages
const AdminLayout = lazy(() => import("@/modules/admin/pages").then(m => ({ default: m.AdminLayout })));
const AdminReservas = lazy(() => import("@/modules/admin/pages").then(m => ({ default: m.AdminReservas })));
const AdminHabitaciones = lazy(() => import("@/modules/admin/pages").then(m => ({ default: m.AdminHabitaciones })));
const AdminPromociones = lazy(() => import("@/modules/admin/pages").then(m => ({ default: m.AdminPromociones })));
const AdminResenas = lazy(() => import("@/modules/admin/pages").then(m => ({ default: m.AdminResenas })));
const AdminSettings = lazy(() => import("@/modules/admin/pages").then(m => ({ default: m.AdminSettings })));
const AdminSelector = lazy(() => import("@/modules/admin/pages").then(m => ({ default: m.AdminSelector })));
const GestionHome = lazy(() => import("@/modules/admin/pages").then(m => ({ default: m.GestionHome })));

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center" aria-busy="true">
    Cargando...
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
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
                <Route path="settings" element={<AdminSettings />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
