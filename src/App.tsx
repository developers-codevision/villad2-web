import { Toaster } from "@/modules/shared/components/ui/toaster";
import { Toaster as Sonner } from "@/modules/shared/components/ui/sonner";
import { TooltipProvider } from "@/modules/shared/components/ui/tooltip";
import WhatsAppFloatingButton from "@/modules/shared/components/WhatsAppFloatingButton";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import React, { lazy, Suspense } from "react";
import { NotFound, ProtectedRoute } from "@/modules/shared/components";
import { AuthProvider } from "@/modules/shared/context";
import { LanguageProvider } from "@/modules/client/contexts";

// Code-splitting: cargar páginas bajo demanda
const Home = lazy(() => import("@/modules/client/pages/Home"));
const Rooms = lazy(() => import("@/modules/client/pages/Rooms"));
const RoomDetail = lazy(() => import("@/modules/client/pages/RoomDetail"));
const Services = lazy(() => import("@/modules/client/pages/Services"));
const Reservations = lazy(() => import("@/modules/client/pages/Reservations"));
const Reviews = lazy(() => import("@/modules/client/pages/Reviews"));
const Promociones = lazy(() => import("@/modules/client/pages/Promociones"));
const Login = lazy(() => import("@/modules/client/pages/Login"));
const InterestPlaces = lazy(() => import("@/modules/client/pages/InterestPlaces"));
const StripeReturn = lazy(() => import("@/modules/client/pages/StripeReturn"));
const RefundPolicies = lazy(() => import("@/modules/client/pages/RefundPolicies"));
const TermsAndConditions = lazy(() => import("@/modules/client/pages/TermsAndConditions"));
const FAQ = lazy(() => import("@/modules/client/pages/FAQ"));
const PrivacyPolicy = lazy(() => import("@/modules/client/pages/PrivacyPolicy"));
const CookiePolicy = lazy(() => import("@/modules/client/pages/CookiePolicy"));
const LegalNotice = lazy(() => import("@/modules/client/pages/LegalNotice"));

// Admin pages
const AdminSelector = lazy(() => import("@/modules/admin/pages/AdminSelector"));
const GestionHome = lazy(() => import("@/modules/admin/pages/GestionHome"));
const AdminLayout = lazy(() => import("@/modules/admin/pages/AdminLayout"));
const AdminReservas = lazy(() => import("@/modules/admin/pages/AdminReservas"));
const AdminHabitaciones = lazy(() => import("@/modules/admin/pages/AdminHabitaciones"));
const AdminPromociones = lazy(() => import("@/modules/admin/pages/AdminPromociones"));
const AdminBlog = lazy(() => import("@/modules/admin/pages/AdminBlog"));
const BlogEditor = lazy(() => import("@/modules/admin/pages/BlogEditor"));
const AdminResenas = lazy(() => import("@/modules/admin/pages/AdminResenas"));
const AdminSettings = lazy(() => import("@/modules/admin/pages/AdminSettings"));

// Client pages
const Blog = lazy(() => import("@/modules/client/pages/Blog"));
const BlogPost = lazy(() => import("@/modules/client/pages/BlogPost"));

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-6" aria-busy="true">
    <img
      src="/favicon.png"
      alt="Villa D2"
      width={80}
      height={80}
      className="h-20 w-20 animate-[pulse_1.5s_ease-in-out_infinite]"
    />
    <div className="flex items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="block h-2 w-2 rounded-full bg-primary animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<LoadingFallback />}>
              <RoutesWrapper />
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

// Separate component to access useLocation()
const RoutesWrapper = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin") || location.pathname.startsWith("/admin-selector") || location.pathname.startsWith("/gestion");

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/habitaciones" element={<Rooms />} />
        <Route path="/habitaciones/:id" element={<RoomDetail />} />
        <Route path="/servicios" element={<Services />} />
        <Route path="/reservas" element={<Reservations />} />
        <Route path="/resenas" element={<Reviews />} />
        <Route path="/promociones" element={<Promociones />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/login" element={<Login />} />
        <Route path="/lugares-interes" element={<InterestPlaces />} />
        <Route path="/payment/success" element={<StripeReturn />} />
        <Route path="/politicas-reembolso" element={<RefundPolicies />} />
        <Route path="/terminos-condiciones" element={<TermsAndConditions />} />
        <Route path="/politica-privacidad" element={<PrivacyPolicy />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/politica-de-cookies" element={<CookiePolicy />} />
        <Route path="/aviso-legal" element={<LegalNotice />} />
        <Route path="/preguntas-frecuentes" element={<FAQ />} />
        <Route path="/admin-selector" element={<ProtectedRoute requireAdmin><AdminSelector /></ProtectedRoute>} />
        <Route path="/gestion" element={<ProtectedRoute requireAdmin><GestionHome /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminReservas />} />
          <Route path="habitaciones" element={<AdminHabitaciones />} />
          <Route path="promociones" element={<AdminPromociones />} />
          <Route path="blog" element={<AdminBlog />} />
          <Route path="blog/nuevo" element={<BlogEditor />} />
          <Route path="blog/:id" element={<BlogEditor />} />
          <Route path="resenas" element={<AdminResenas />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAdminRoute && <WhatsAppFloatingButton />}
    </>
  );
};

export default App;
