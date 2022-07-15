import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Config from "../config";
import GlobalState from "../GlobalState";
import { getControlData } from "../Helpers";
import { ComponentTemplate } from "../templates/ComponentTemplate";

const Component = () => {
  const { componentId } = useParams();
  const [error, setError] = useState(false);
  const [component, setComponent] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [selectedControl, setSelectedControl] = useState(false);
  const [state, setState] = useContext(GlobalState);

  useEffect(() => {
    if (component.id !== parseInt(componentId)) {
      fetch(`${Config("backendUrl")}/components/${componentId}/`, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((response) => response.json())
        .then((component) => {
          if (component !== undefined && component.id !== undefined) {
            setState((state) => ({ ...state, component: component }));
            return setComponent(component);
          } else {
            setErrorMessage(component.response || "Error loading component");
            return setError(true);
          }
        })
        .catch((error) => {
          return setError(error);
        });
    }
  }, [componentId, component]);

  const getControl = (controlId) => {
    let control = getControlData(component, controlId);
    setSelectedControl(control);
  };

  if (error) {
    return <h1>Component not found</h1>;
  }

  if (Object.keys(component).length > 0) {
    return (
      <ComponentTemplate
        component={component}
        controlText={selectedControl}
        catalogData={getControl}
      />
    );
  } else {
    return <h1>{errorMessage}</h1>;
  }
};

export default Component;
