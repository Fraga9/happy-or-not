import useFeedbacks from "../services/useFeedbacks";

const Dashboard = () => {
  const feedbacks = useFeedbacks();

  return (
    <div>
      <h2>Respuestas de Clientes</h2>
      <ul>
        {feedbacks.map((fb, index) => (
          <li key={index}>
            {fb.sucursal}: {fb.feedback}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
