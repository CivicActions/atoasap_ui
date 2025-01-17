import { Checkbox, Search } from "@trussworks/react-uswds";
import { useState } from "react";
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { Link } from "react-router-dom";
import { CATALOG_DISPLAY_NAMES } from "../constants";
import { MAIN_ROUTES } from "../AppRoutes";
import Pagination from "../molecules/Pagination";

const TableRow = ({ component }) => {
  if (component.title === undefined) {
    return "";
  }
  return (
    <>
      <td>
        <Link to={`/components/${component.id}`}>{component.title}</Link>
      </td>
      <td>{component.description}</td>
      <td>{component.controls_count}</td>
    </>
  );
};

const EmptyResults = ({ length }) => {
  if (length !== 0) {
    return "";
  }
  return (
    <p>
      There are no components in your project yet. Add one by visiting the{" "}
      <Link to={MAIN_ROUTES.COMPONENT_LIBRARY}>Component Library</Link>.
    </p>
  );
};

const FilterCol = ({
  typeList,
  currentType,
  currentCatalog,
  checkBoxHandler,
}) => {
  const isCheckedType = (value) => {
    if (currentType.includes(value)) {
      return true;
    }
    return false;
  };
  const isCheckedCatalog = (value) => {
    if (currentCatalog.includes(value)) {
      return true;
    }
    return false;
  };
  return (
    <>
      <div className="component-library-filter grid-col-2">
        <fieldset className="usa-fieldset">
          <legend className="usa-legend">Type</legend>
          {typeList.map((type, i) => (
            <Checkbox
              id={type[0] + "-filter"}
              name={type[0] + "-filter"}
              label={type[0]}
              value={"type=" + type[0]}
              onChange={checkBoxHandler}
              key={i}
              checked={isCheckedType(type[0])}
            />
          ))}
        </fieldset>
        <fieldset className="usa-fieldset catalog-filter xxx">
          <legend className="usa-legend">Catalog</legend>
          {Object.entries(CATALOG_DISPLAY_NAMES).map(([key, value]) => (
            <Checkbox
              id={key + "-filter"}
              name={value + "-filter"}
              label={value}
              value={"catalog_version=" + key}
              onChange={checkBoxHandler}
              key={key}
              checked={isCheckedCatalog(key)}
            />
          ))}
        </fieldset>
      </div>
      <div className="grid-col-1"></div>
    </>
  );
};
// this seems overly complex when it is not doing much :/ defining variables, setting url params, callbacks, template varibles finished, template
const SearchLibrary = ({
  componentList = [],
  linkToComponentLibrary = false,
  typeList = [],
  totalItemCount = 0,
}) => {
  const baseUrl = useLocation();
  let navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSearch, setCurrentSearch] = useState("");
  const [currentType, setCurrentType] = useState([]);
  const [currentCatalog, setCurrentCatalog] = useState([]);

  //set the url query params into state
  const [searchParams] = useSearchParams();
  if (
    Number(searchParams.get("page")) &&
    currentPage !== Number(searchParams.get("page"))
  ) {
    setCurrentPage(Number(searchParams.get("page")));
  }
  if (
    searchParams.get("search") &&
    currentSearch !== searchParams.get("search")
  ) {
    setCurrentSearch(searchParams.get("search"));
  }

  if (
    searchParams.get("type") &&
    !currentType.includes(searchParams.get("type"))
  ) {
    setCurrentType(searchParams.getAll("type"));
  }
  if (
    searchParams.get("catalog_version") &&
    !currentCatalog.includes(searchParams.get("catalog_version"))
  ) {
    let values = [];
    searchParams.getAll("catalog_version").forEach((element) => {
      values.push(element);
    });
    setCurrentCatalog(values);
  }

  // Functions to generate query strings
  const getSearchQuery = () => {
    let url = "";
    if (currentSearch) {
      url += "search=" + currentSearch + "&";
    }
    return url;
  };
  const getFiltersQuery = () => {
    let url = "";
    if (currentType) {
      currentType.forEach((element) => {
        url += "type=" + element + "&";
      });
    }
    if (currentCatalog) {
      currentCatalog.forEach((element) => {
        url += "catalog_version=" + element + "&";
      });
    }
    return url;
  };
  const getPageQuery = () => {
    let url = "";
    if (currentPage) {
      url += "page=" + currentPage + "&";
    }
    return url;
  };

  // Call back functions used for updating values from the page
  //callback function to change the current page
  const onPageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  //callback function from search component
  const componentNameSearch = () => {
    const query = document.querySelector("#search-input").value;
    let searchParams = "?";
    searchParams += getFiltersQuery();
    searchParams += "search=" + query;
    navigate({
      pathname: baseUrl.pathname,
      search: searchParams,
    });
    window.location.reload();
  };
  // callback function to gather values from checkboxes and update url query params
  const checkBoxHandler = () => {
    let newQuery = "?";
    newQuery += getPageQuery();
    newQuery += getSearchQuery();

    var checkboxes = document.querySelectorAll(
      'input[type="checkbox"]:checked'
    );
    for (var checkbox of checkboxes) {
      if (!newQuery.includes(checkbox.value)) {
        newQuery += checkbox.value + "&";
      }
    }
    navigate({
      pathname: baseUrl.pathname,
      search: `?${createSearchParams(newQuery)}`,
    });
    window.location.reload();
  };

  // format url for pagination
  let paginationUrl = baseUrl.pathname + "?";
  paginationUrl += getSearchQuery();
  paginationUrl += getFiltersQuery();

  return (
    <>
      <div className="grid-row">
        <div className="grid-col-5">
          {linkToComponentLibrary && (
            <Link to={MAIN_ROUTES.COMPONENT_LIBRARY}>
              <button className="usa-button usa-button--outline add-component-button">
                Add from the Component Library
              </button>
            </Link>
          )}
        </div>
        <div className="grid-col-7">
          <Search
            onSubmit={function (e) {
              e.stopPropagation();
              e.preventDefault();
              componentNameSearch();
            }}
            placeholder={currentSearch}
            className="width-full"
            inputId="search-input"
          />
        </div>
      </div>
      <div className="grid-row">
        <FilterCol
          typeList={typeList}
          currentType={currentType}
          currentCatalog={currentCatalog}
          checkBoxHandler={checkBoxHandler}
        />
        <div className="grid-col-9">
          <table
            data-testid="table"
            className="usa-table width-full usa-table--striped"
          >
            <thead>
              <tr>
                <th scope="col">Component</th>
                <th scope="col">Description</th>
                <th scope="col">Controls</th>
              </tr>
            </thead>
            <tbody>
              {componentList.map((component, i) => (
                <tr key={i}>
                  <TableRow component={component} />
                </tr>
              ))}
            </tbody>
          </table>
          <EmptyResults length={totalItemCount} />
          <Pagination
            onPageChange={onPageChange}
            totalCount={totalItemCount}
            currentPage={currentPage}
            baseUrl={paginationUrl}
          />
        </div>
      </div>
    </>
  );
};

export default SearchLibrary;
