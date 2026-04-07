import { Navigate, Route, Routes } from "react-router"
import LoginPage from "./pages/Auth/LoginPage"
import RegisterPage from "./pages/Auth/RegisterPage"



function App() {


  return (
   <Routes>
       <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />


      {/* TODO:  add protected route */}
      {/* <Route path='/dashboard' element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} /> */}

      <Route path='/' element={<Navigate to="/login" replace />} />
   </Routes>
  )
}

export default App
