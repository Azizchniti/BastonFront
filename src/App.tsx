
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

import AuthenticatedLayout from "@/components/AuthenticatedLayout";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Admin pages

import AdminMembers from "./pages/admin/Members";
import AdminChamadas from "./pages/admin/Chamadas";



// Member pages

import ProfilePage from "./pages/member/Profile";
import UserChamadas from "./pages/member/Chamadas";
import UserChamadasCriadas from "./pages/member/MeusChamados";
import UserMessaging from "./pages/member/Messaging";

import Signup from "./pages/Signup";
import { AnnouncementProvider } from "./contexts/AnnouncementContext";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import { DataProvider } from "./contexts/DataContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
    
    
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
               <Route path="/signup" element={<Signup />} /> 
               <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/sendemail" element={<ForgotPassword />} />
              
              {/* Admin routes */}
            

              <Route 
                path="/admin/members" 
                element={
                  <AuthenticatedLayout requiredRole="admin">
                    <DataProvider>
                        <AdminMembers />
                  </DataProvider>
                  </AuthenticatedLayout>
                } 
              />


           

              <Route 
                path="/admin/chamados" 
                element={
                  <AuthenticatedLayout requiredRole="admin">
                    <AdminChamadas />
                  </AuthenticatedLayout>
                } 
              />

             

              <Route 
                path="/admin/reports" 
                element={
                  <AuthenticatedLayout requiredRole="admin" >
                    <div>Página de Relatórios (Admin)</div>
                  </AuthenticatedLayout>
                } 
              />
              
              {/* Member routes */}
        

              <Route 
                path="/user/profile" 
                element={
                  <AuthenticatedLayout requiredRole="user" >
                    <ProfilePage/>
                  </AuthenticatedLayout>
                } 
              />

              <Route 
                path="/user/chamados" 
                element={
                  <AuthenticatedLayout requiredRole="user">
                    <UserChamadas />
                  </AuthenticatedLayout>
                } 
              />

              <Route 
                path="/user/meuschamados" 
                element={
                  <AuthenticatedLayout requiredRole="user">
                    <UserChamadasCriadas />
                  </AuthenticatedLayout>
                } 
              />
               <Route 
                path="/user/messages/:taskId"
                element={
                  <AuthenticatedLayout requiredRole="user">
                    <UserMessaging />
                  </AuthenticatedLayout>
                } 
              />


              <Route 
                path="/member/member/new" 
                element={
                  <AuthenticatedLayout requiredRole="user" >
                    <div>Cadastrar Novo Membro (Membro)</div>
                  </AuthenticatedLayout>
                } 
              />


             
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
       
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
