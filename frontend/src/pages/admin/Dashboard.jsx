import { useEffect, useState, useMemo } from "react";
import useAxios from "../../hooks/useAxios";
import Loading from "../../UI/Loading";
import ChartsContainer from "../../components/Charts/ChartsContainer";
import { FaUserShield, FaListUl, FaEnvelope, FaUsers } from "react-icons/fa6";
import TableFetchError from "../../components/Table/TableFetchError";
import Button from "../../UI/Button";

const Dashboard = () => {
  const cards = useMemo(
    () => [
      { label: "Admins", icon: <FaUserShield className="text-4xl" /> },
      { label: "Categories", icon: <FaListUl className="text-4xl" /> },
      { label: "Complaints", icon: <FaEnvelope className="text-4xl" /> },
      { label: "Users", icon: <FaUsers className="text-4xl" /> },
    ],
    []
  );

  const [totals, setTotals] = useState();
  const [totalsLoading, setTotalsLoading] = useState(true);

  const { data: totalNumbers, error: totalNumbersHasError } = useAxios(
    `http://127.0.0.1:5000/api/v1/total-numbers`,
    "GET"
  );

  useEffect(() => {
    if (totalNumbers) {
      const mergedArray = cards.map((card, index) => {
        const total = Object.values(totalNumbers)[index];
        return { ...card, total };
      });

      setTotals(mergedArray);
      setTotalsLoading(false);
    }
  }, [cards, totalNumbers]);

  const {
    data: complaintsPerMonth,
    loading: complaintsPerMonthLoading,
    error: complaintsPerMonthHasError,
  } = useAxios(
    `http://127.0.0.1:5000/api/v1/complaints/complaints-per-month`,
    "GET"
  );

  const {
    data: usersPerMonth,
    loading: usersPerMonthLoading,
    error: usersPerMonthHasError,
  } = useAxios(
    `http://127.0.0.1:5000/api/v1/users/users-per-month`,
    "GET"
  );
  const {
    data: data
  } = useAxios(
    `http://127.0.0.1:5000/api/v1/complaints/date-vs-rating`,
    "GET"
  );
  // datevsrating ="Some date and rating"
  // console.log(datevsrating)

  if (totalsLoading || complaintsPerMonthLoading || usersPerMonthLoading) {
    return <Loading />;
  }

  if (
    totalNumbersHasError ||
    complaintsPerMonthHasError ||
    usersPerMonthHasError
  ) {
    return <TableFetchError title="Dashboard" />;
  }

  return (
    <>
      <h1 className="mb-5 text-3xl font-semibold tracking-wide">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {totals?.map((item, index) => (
          <div
            className="py-8 flex flex-col items-center gap-3 bg-white shadow-md rounded-lg text-sky-500 tracking-wider"
            key={index}
          >
            {item.icon}
            <p className="text-xl text-black">{item.label}</p>
            <p className="text-2xl text-black">{item.total}</p>
          </div>
        ))}
      </div>
      <ChartsContainer
        complaintsPerMonth={complaintsPerMonth}
        usersPerMonth={usersPerMonth}
      />

  {/* <LineChart width={600} height={300} data={datevsrating}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="time" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="rating" stroke="#8884d8" />
  </LineChart> */}
{/* {data} */}
{/* <button
      className={`w-fit py-2 px-5 bg-primary-color rounded-md outline-none text-white text-[15px] font-bold tracking-wider opacity-[0.75] cursor-pointer transition duration-700 hover:opacity-100`}
    >
      View Dashboard
    </button> */}
    <Button className= "mt-5">

    <a href="https://aniketthorat0809.grafana.net/d/edix10gy1ul8ge/complaintmanagementsystem?orgId=1" target="_blank">View Dashboard</a>
    </Button>
    </>
  );
};

export default Dashboard;
