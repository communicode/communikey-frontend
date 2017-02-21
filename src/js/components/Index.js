import React from "react";
import { Menu } from "semantic-ui-react";
import SidebarLeftPush from "./SidebarLeftPush";
import "../../css/components/Index.css";

export default class Index extends React.Component {
    render() {
        return (
          <div>
            <SidebarLeftPush></SidebarLeftPush>
          </div>
        );
    }
}
