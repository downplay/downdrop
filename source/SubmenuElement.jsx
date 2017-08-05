import React from "react";
import styles from "./styles/menu.css";

// eslint-disable-next-line react/prop-types
export default ({ children, onClick, ...others }) => (
    <nav className={styles.submenu} {...others}>
        {this.props.children}
    </nav>
);
