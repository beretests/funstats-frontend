import React from "react";
import { Fab, Tooltip } from "@mui/material";
import BugReportIcon from "@mui/icons-material/BugReport";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";

const GITHUB_OWNER = "beretests";
const GITHUB_REPO = "funstats-frontend";

const GitHubIssueButton: React.FC = () => {
  const handleOpenIssue = () => {
    //     const title = encodeURIComponent("New issue report");
    //     const body = encodeURIComponent(
    //       "Describe your issue or feature request here."
    //     );
    //     const labels = encodeURIComponent("bug, enhancement");

    // const issueUrl = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/issues/new?title=${title}&body=${body}&labels=${labels}`;
    const issueUrl = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/issues/new`;

    window.open(issueUrl, "_blank");
  };

  return (
    <Tooltip
      title="Report Issue / Request Feature"
      className="!fixed !bottom-4 !right-4"
    >
      <Fab color="primary" className="  shadow-lg" onClick={handleOpenIssue}>
        <ContactSupportIcon />
      </Fab>
    </Tooltip>
  );
};

export default GitHubIssueButton;
