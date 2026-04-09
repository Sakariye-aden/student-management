import { Link, Outlet } from "react-router"

const TeacherDashboard = () => {
  return (
    <div>
      <h1> welcome to Teacher Dashboard</h1>
      <nav>
        <ul>
          <li><Link to="/teacher">Dashboard</Link></li>
          <li><Link to="result">Insert Result</Link></li>
          <li><Link to="plan">teacher Plan</Link></li>
          <li><Link to="mysubjects">My Subject</Link></li>
        </ul>
      </nav>
      <Outlet /> {/* nested pages */}

      
    </div>
  )
}

export default TeacherDashboard