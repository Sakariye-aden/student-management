import { Navigate, Route, Routes } from "react-router"
import LoginPage from "./pages/Auth/LoginPage"
import RegisterPage from "./pages/Auth/RegisterPage"
import ProtectedRoute from "./components/Auth/ProtectedRoute"
import ViceDashboard from "./pages/vice principle/VcDashboard"
import PublicRoute from "./components/Auth/AuthorizeRoute"


function App() {


  return (
   <Routes>
       <Route path='/login' 
         element={<PublicRoute><LoginPage /> </PublicRoute> } 
       />
      <Route path='/register' element={<PublicRoute><RegisterPage /></PublicRoute> } 
      
      />


      {/* TODO:  add protected route */}
      <Route path='/dashboard' element={<ProtectedRoute> <ViceDashboard/> </ProtectedRoute>} />

      <Route path='/' element={<Navigate to="/login" replace />} />
   </Routes>
  )
}

export default App
