import Header from "./Header";
import Sidebar from "./Sidebar";

const Dashboard = ({ children }) => {
  return (
    <div>
      <Sidebar />

      <main>
        <Header />
        {children}
      </main>
    </div>
  );
};

export default Dashboard;
