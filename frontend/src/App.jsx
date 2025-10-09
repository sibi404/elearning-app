import { Link } from "react-router-dom";

function App() {

  return (
    <>
      {/* <StudentDashboard /> */}
      <div className="h-screen flex items-center justify-center gap-5">
        <Link to={'/student'}>
          <button className="bg-black text-white font-bold py-2 px-4 cursor-pointer">STUDENT</button>
        </Link>
        <Link to={'/teacher'}>
          <button className="bg-black text-white font-bold py-2 px-4 cursor-pointer">TEACHER</button>
        </Link>
        <button className="bg-black text-white font-bold py-2 px-4 cursor-pointer">ADMIN</button>
      </div>
    </>
  );
};

export default App;
