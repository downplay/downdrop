import React, { Component } from "react";
import PropTypes from "prop-types";

import ContextSubmenu from "./ContextSubmenu";
import ButtonElement from "./ButtonElement";
import LabelElement from "./LabelElement";
import LinkElement from "./LinkElement";
import SeparatorElement from "./SeparatorElement";
import ItemWrapper from "./ItemWrapper";

import styles from "./styles/menu.css";

class ContextMenuItem extends Component {

    static propTypes = {
        type: PropTypes.oneOf(["label", "button", "link", "separator", "submenu"]),
        content: PropTypes.node,
        onClick: PropTypes.func,
        onMenuClick: PropTypes.func,
        menu: PropTypes.arrayOf(PropTypes.object),
    }

    static defaultProps = {
        type: "label",
        content: null,
        onClick: null,
        onMenuClick: null,
        menu: [],
    }

    constructor(props) {
        super(props);
        this.state = {
            submenuVisible: false,
        };
    }

    // TODO: On receive props / will receive props, verify correct action is there e.g. handler/to

    onSubmenuMouseEnter = () => {
        this.setState({
            submenuVisible: true,
        });
    }

    onSubmenuMouseLeave = () => {
        this.setState({
            submenuVisible: false,
        });
    }

    onButtonClick = (event) => {
        // For links there is no button handler (although consumers
        // can still provide one, e.g. to preventDefault or whatever)
        if (this.props.onClick) {
            // Execute the click handler
            this.props.onClick(event);
        }
        // Trigger provider to close the menu
        this.props.onMenuClick(event);
    }

    renderInnerElement() {
        const { type, content, onClick, onMenuClick, menu, item, className,
            ...others } = this.props;
        others.className = `${styles[this.props.type] || ""} ${this.props.className}`;
        switch (this.props.type) {
        case "label":
            return <LabelElement {...others}>{content}</LabelElement>;
        case "separator":
            return <SeparatorElement {...others} />;
        case "submenu":
            // A bit of a special case
            return (
                <ContextSubmenu
                    menu={menu}
                    onMenuClick={onMenuClick}
                    onMouseEnter={this.onSubmenuMouseEnter}
                    onMouseLeave={this.onSubmenuMouseLeave}
                    {...others}
                >
                    {content}
                </ContextSubmenu>
            );
        case "link":
            return (
                <LinkElement {...others} onClick={this.onButtonClick}>
                    {this.props.content}
                </LinkElement>);
        case "button":
        default:
            return (
                <ButtonElement {...others} onClick={this.onButtonClick}>
                    {content}
                </ButtonElement>
            );
        }
    }

    render() {
        // .item .thing .custom
        const className = `${styles.item} ${styles[this.props.type]} ${this.props.className}`;
        return (
            <ItemWrapper className={className}>
                {this.renderInnerElement()}
            </ItemWrapper>
        );
    }

}

export default ContextMenuItem;
