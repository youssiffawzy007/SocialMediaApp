import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

export default function BackButton({className = ""}) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      className={`text-sm font-bold text-[#314158] px-3 py-2 border-1 border-gray-200 rounded-lg bg-white hover:bg-[#F8FAFC] transition-all ${className}`}
    >
      <FontAwesomeIcon className="me-1 font-normal" icon={faArrowLeft} /> Back
    </button>
  );
}
