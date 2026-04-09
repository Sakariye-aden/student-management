import { Link, Outlet } from "react-router"


const ViceDashboard = () => {
  return (
  
  <div>
      <h1> welcome Vice Principal Dashboard</h1>
      <nav>
        <ul>
          <li><Link to="/vice-principal">Dashboard</Link></li>
          <li><Link to="students">Register Student</Link></li>
          <li><Link to="teachers">Register Teacher</Link></li>
          <li><Link to="subjects">Register Subject</Link></li>
          <li><Link to="enrolls">Enroll Students to Subjects</Link></li>
          <li><Link to="results">Results & Ranks</Link></li>
        </ul>
      </nav>
      <Outlet /> {/* nested pages */}
    </div>

  )
}

export default ViceDashboard