import DateFormatter from "../../UI/DateFormatter";
import StatusFormatter from "../../UI/StatusFormatter";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

const TableRow = ({ element, linkTo, table }) => {
  const navigate = useNavigate();

  let result = [];

  let i = 0;
  for (const [, value] of Object.entries(element)) {
    result.push({
      value,
      colSize: table[i].colSize,
      label: table[i].label,
      isDate: table[i].isDate,
      isStatus: table[i].isStatus,
    });
    i++;
  }

  return (
    <tr
      className={`bg-white border-b ${
        linkTo && "cursor-pointer transition duration-100 hover:bg-gray-50"
      }`}
      onClick={linkTo ? () => navigate(linkTo) : () => {}}
    >
      {result.map((item) => (
        <td key={item.value} className="px-6 py-4">
          {item.isDate ? (
            <DateFormatter date={item.value} />
          ) : item.isStatus ? (
            <StatusFormatter status={item.value} />
          ) : (
            item.value
          )}
        </td>
      ))}
      <td className="px-6 py-4">
          <FontAwesomeIcon
            icon={faEdit}
            className="text-blue-500 cursor-pointer"
            onClick={ element.number !== undefined ? () => navigate(`/categories/${element.id}`) : () => navigate(`/users/${element.id}`) }
          />
      </td>
    </tr>
  );
};

export default TableRow;
