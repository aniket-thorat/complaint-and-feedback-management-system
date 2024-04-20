import { Link, useParams } from "react-router-dom";
import useAxios from "../hooks/useAxios";
import Alert from "../UI/Alert";
import Hero from "../UI/Hero";
import PaginationHandler from "../UI/PaginationHandler";
import StatusFormatter from "../UI/StatusFormatter";
import DateFormatter from "../UI/DateFormatter";
import UserPageLoading from "../components/States/UserPageLoading";
import UserPageError from "../components/States/UserPageError";
import Section from "../layout/Section";
import Button from "../UI/Button"
import botImage from "../assets/bot-removebg-preview.png";
const MyComplaints = () => {
  let { page: currentPage } = useParams();
  const elementsPerPage = 10;
  const start = (currentPage - 1) * elementsPerPage;
  const end = start + elementsPerPage;

  const {
    data: userComplaints,
    loading: userComplaintsLoading,
    error: userComplaintsHasError,
  } = useAxios("http://127.0.0.1:5000/api/v1/complaints", "GET");

  if (userComplaintsLoading) {
    return <UserPageLoading title="My Complaints" />;
  }

  if (userComplaintsHasError) {
    return <UserPageError title="My Complaints" />;
  }

  return (
    <>
      <Hero title="My Complaints" />
      <Section className="flex flex-col gap-6">
        <Alert
          path="/create-complaint"
          icon={true}
          text="Need help? Create a new complaint from here."
        />
        <div className="flex flex-col gap-4">
          {userComplaints.slice(start, end).map((complaint) => (
            <div
              key={complaint._id}
              className="w-full pb-2 border-b last-of-type:border-b-0 text-gray-700 font-semibold transition duration-500 hover:text-gray-900"
            >
              <Link
                to={`/complaint/${complaint._id}`}
                className="md:grid md:grid-cols-12 items-center"
              >
                <p className="col-span-5 text-lg">
                  <span className="md:hidden font-bold">Title: </span>
                  {complaint.title.length > 20
                    ? complaint.title.slice(0, 20) + "..."
                    : complaint.title}
                </p>
                <p className="col-span-3">
                  <span className="md:hidden font-bold">Category: </span>
                  {complaint.category}
                </p>
                <p className="col-span-3">
                  <span className="md:hidden font-bold">Created: </span>
                  <DateFormatter date={complaint.date_created} />
                </p>
                <p className="col-span-1 justify-self-end">
                  <span className="md:hidden font-bold">Status: </span>
                  <StatusFormatter status={complaint.status} />
                </p>
              </Link>
            </div>
          ))}
        </div>
		
        <PaginationHandler
          currentPage={currentPage}
          elementsPerPage={elementsPerPage}
          dataLength={userComplaints.length}
        />
		
      </Section>
	  <div style={{float:"right", marginRight:"100px"}}>
		<div>

          <a href="http://localhost:3000/chatbot" style={{float:"right", display:"block"}}>
            <img src={botImage} title="Chatbot" alt = "This is bot image" style={{width:"85px", height:"85px", float:"right"}}/>
          </a>
		 
		</div>
		<div><a href="http://localhost:3000/chatbot" style={{float:"right", display:"block"}}><i> Chat with bot </i></a></div>
		</div>
		<div>
		{/* <div style={{float:"right"}}>
			<p style={{float:"right"}}>Having trouble? Chat with AI Bot</p>
		  </div> */}
		</div> 
    </>
  );
};

export default MyComplaints;
