import { Checkbox } from "@trussworks/react-uswds";
import Config from "../config";
import { useState } from "react";
import { Navigate } from "react-router-dom";

const TableRow = ({ component }) => {
  if (component.title === undefined) {
    return "";
  }
  return (
    <>
      <td>
        <Checkbox
          id={"component-id-" + component.id}
          name="component-id-list"
          value={component.id}
        />
      </td>
      <td>{component.title}</td>
      <td>{component.description}</td>
      <td>{component.controls_count}</td>
    </>
  );
};

const ProjectSetupSelectComponentsTemplate = ({ componentList }) => {
  const [error, setError] = useState(false);
  const [response, setResponse] = useState(false);
  const localStorageProject = JSON.parse(localStorage.getItem("project"));
  const projectId = localStorageProject.id;
  const projectUrl = "/projects/" + projectId;

  function postProjectAddComponent(formValues) {
    fetch(`${Config("backendUrl")}/projects/add-component/`, {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(formValues),
    })
      .then((response) => response.json())
      .then((response) => {
        return setResponse(true);
      })
      .catch((error) => {
        return setError(error);
      });
  }

  const formSubmit = () => {
    let postVariables = {};
    postVariables["project_id"] = projectId;
    postVariables["creator"] = 2; // @TODO: change for your local environment/demo
    let checkedList = document.querySelectorAll(
      "input[type='checkbox']:checked"
    );
    checkedList.forEach(getValue);
    function getValue(checkbox) {
      postVariables["component_id"] = checkbox.value;
      postProjectAddComponent(postVariables);
    }

    if (checkedList.length === 0) {
      setResponse(true);
    }
  };

  let saved = false;
  if (response) {
    saved = true;
  }

  return (
    <div className="select-components">
      {saved && <Navigate to={projectUrl} />}
      <h1>Select components for your system technologies</h1>
      <ul className="usa-list">
        <li>
          Blueprint matches your system's technologies to components, which
          include groups of related controls and control narratives.
        </li>
        <li>
          Select the components that apply to the technologies your system is
          using.
        </li>
        <li>
          As you continue to build your system, use the Component Library to add
          components to develop your System Security Plan.
        </li>
      </ul>
      <table
        data-testid="table"
        className="usa-table width-full usa-table--striped"
      >
        <thead>
          <tr>
            <th scope="col"></th>
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
      <a href="/project-setup/confirmation">
        <button className="usa-button usa-button--outline">Back</button>
      </a>
      <button className="usa-button" onClick={formSubmit}>
        Confirm
      </button>
    </div>
  );
};

export default ProjectSetupSelectComponentsTemplate;