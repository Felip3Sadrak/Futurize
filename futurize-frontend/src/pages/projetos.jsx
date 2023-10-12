import Buttons from "../components/Buttons/Buttons";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Table from '../components/Table/Table';
import '../../public/assets/css/projetos.css';

export default function Home() {
  const { signout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signout();
    navigate("/");
  };
    return (
      <div className='container'>
      
      <Table></Table>
      {/* <Buttons onClick={handleLogout}>Sair
      </Buttons> */}
      </div>
    )
  }
