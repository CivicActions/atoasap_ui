import { Accordion } from "@trussworks/react-uswds";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import ResponsibilityBox from "../atoms/ResponsibilityBox";
import { CATALOG_DISPLAY_NAMES } from "../constants";
import ComponentProjectForm from "../organisms/ComponentProjectForm";
import ControlHeader from "../organisms/ControlHeader";

export function ComponentTemplate({
  catalogData,
  catalogVersion,
  componentData,
  componentId,
  projectData,
  selectedControl,
  handleSelectControl,
  handleProjectUpdate,
}) {
  const { title, description } = componentData;
  const standards = componentData.standards;
  const componentControls = componentData.standards[catalogVersion].controls;

  const selectedControlCatalogData = {
    low: catalogData[catalogVersion].low.controls[selectedControl],
    moderate: catalogData[catalogVersion].moderate.controls[selectedControl],
    high: catalogData[catalogVersion].high.controls[selectedControl],
  };
  const selectedControlComponentData = componentControls[selectedControl];

  const getImplementationText = (level) => {
    if (
      selectedControlCatalogData &&
      selectedControlCatalogData[level].implementationStandards
    ) {
      return selectedControlCatalogData[level].implementationStandards;
    } else {
      return "No implementation standards found for this control.";
    }
  };

  const getControlGuidanceText = (level) => {
    if (
      selectedControlCatalogData &&
      selectedControlCatalogData[level].guidance
    ) {
      return selectedControlCatalogData[level].guidance;
    } else {
      return "No control guidance found for this control.";
    }
  };

  const getNarrativeText = () => {
    if (
      selectedControlComponentData &&
      selectedControlComponentData.narrative
    ) {
      return selectedControlComponentData.narrative;
    } else {
      return "No narrative found for this control.";
    }
  };

  function renderTopSection() {
    return (
      <div className="grid-row">
        <div className="tablet:grid-col padding-top-1">
          <p>
            <b>
              {Object.keys(standards).length > 1 ? "Standards" : "Standard"}:{" "}
            </b>
            {Object.keys(standards).map((key, index) => (
              <a
                className={"margin-x-1"}
                href={standards[key]["source"]}
                key={index}
              >
                {CATALOG_DISPLAY_NAMES[key]}
              </a>
            ))}
          </p>
        </div>
        <div className="tablet:grid-col">
          <ComponentProjectForm
            projectData={projectData}
            componentId={componentId}
            handleProjectUpdate={handleProjectUpdate}
          />
        </div>
      </div>
    );
  }

  function renderControlsList() {
    return (
      <ul className="usa-sidenav">
        {Object.entries(componentControls).map(([key, index]) => (
          <li className="usa-sidenav__item" key={index}>
            <a href={"#" + key} onClick={() => handleSelectControl(key)}>
              {key}
            </a>
          </li>
        ))}
      </ul>
    );
  }

  function renderControlLevelSection(level) {
    const accordionItemsProps = [
      {
        title: "Component Narrative",
        content: <p>{getNarrativeText()}</p>,
        expanded: true,
        id: "inherited_narratives",
        headingLevel: "h3",
      },
      {
        title: "Implementation Standards",
        content: <p>{getImplementationText(level)}</p>,
        expanded: false,
        id: "implementation_standards",
        headingLevel: "h3",
      },
      {
        title: "Discussion",
        content: <p>{getControlGuidanceText(level)}</p>,
        expanded: false,
        id: "control_guidance",
        headingLevel: "h3",
      },
    ];
    return (
      <>
        <ControlHeader
          control={selectedControlCatalogData[level]}
          controlId={selectedControl}
        />
        <ResponsibilityBox
          responsibilityForControl={selectedControlComponentData.responsibility}
        />
        <div className="control-page">
          <Accordion
            items={accordionItemsProps}
            multiselectable
            bordered
            className={"control-page-accordion"}
          />
        </div>
      </>
    );
  }

  function renderControlInfo() {
    const levels = ["low", "moderate", "high"];
    let accordionControlSections = [];

    levels.forEach((level) => {
      let accordionItemProps = {
        expanded: false,
        headingLevel: "h3",
      };
      accordionItemProps.title = `Impact level: ${level}`;
      accordionItemProps.id = `${level}`;
      accordionItemProps.content = renderControlLevelSection(level);
      accordionControlSections.push(accordionItemProps);
    });
    return (
      <Accordion
        items={accordionControlSections}
        multiselectable={false}
        className={"impact-level-accordion"}
      />
    );
  }

  function renderDefaultText() {
    return (
      <>
        <p>
          System components are group(s) of control narratives that help you
          create your System Security Plan faster. Components align with your
          system's architecture, policies and procedures.
        </p>
        <p>
          This {title} component includes all of the controls listed on the
          left. If this component applies to your system, add it to your
          project.
        </p>
      </>
    );
  }

  return (
    <div className="component-page">
      <h1>{title}</h1>
      <p>{description}</p>
      {renderTopSection()}
      <div className="border-top margin-top-4" id="controls">
        <div className="grid-row">
          <div className="grid-col-2">
            <div className="controls-list-header">Controls</div>
            <nav aria-label="Secondary navigation">{renderControlsList()}</nav>
          </div>
          <div className="grid-col-fill padding-4 margin-x-2">
            {selectedControl
              ? renderControlLevelSection("high")
              : renderDefaultText()}
            <p>
              <Link to="/components">Back to Component Library</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

ComponentTemplate.propTypes = {
  catalogData: PropTypes.object,
  catalogVersion: PropTypes.string,
  componentData: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    standards: PropTypes.object,
  }),
  componentId: PropTypes.number,
  projectData: PropTypes.object,
  selectedControl: PropTypes.string,
  handleProjectUpdate: PropTypes.func,
  handleSelectControl: PropTypes.func,
};
