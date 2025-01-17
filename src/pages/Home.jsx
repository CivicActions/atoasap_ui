import React from "react";
import { Link } from "react-router-dom";
import { MAIN_ROUTES } from "../AppRoutes";

export default function Home() {
  return (
    <div className="homepage">
      <h1>Welcome to Rapid ATO</h1>
      <p className="subtitle">
        Collaboratively write control, narratives. Never start from scratch.
      </p>

      <ol className="usa-process-list">
        <li className="usa-process-list__item">
          <h2 className="usa-process-list__heading">Enter basic information</h2>
          <p className="margin-top-05">
            System name, acronym, location, FISMA Impact Level
          </p>
        </li>
        <li className="usa-process-list__item">
          <h2 className="usa-process-list__heading">Select components</h2>
          <p>Groups of inherited and pre-written control narratives</p>
        </li>
        <li className="usa-process-list__item">
          <h2 className="usa-process-list__heading">Add your project team</h2>
          <p>
            Invite team members to collaborate and write control narratives in
            Rapid ATO
          </p>
        </li>
        <li className="usa-process-list__item">
          <h2 className="usa-process-list__heading">
            Edit, review and finalize narratives
          </h2>
          <p>Complete narratives and confirm all required controls are met</p>
        </li>
      </ol>

      <Link to={MAIN_ROUTES.PROJECT_SETUP}>
        <button className="usa-button">Get started now</button>
      </Link>

      <div className="usa-card-group grid-row padding-top-5">
        <div className="usa-card__container grid-col-4">
          <div className="usa-card__header">
            <h3>Continue a project</h3>
          </div>
          <div className="usa-card__body">
            <span>
              Access existing project(s) and continue addressing controls.
            </span>
          </div>
          <div className="usa-card__footer">
            <Link to="/projects">
              <button className="usa-button usa-button--outline">
                Access projects
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
