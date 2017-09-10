import React, { Component } from "react";
import PropTypes from "prop-types";

import { dragDropContextShape } from "./DragDropProvider";

export default class DragHandle extends Component {
    static propTypes = {
        data: PropTypes.any,
        onDrag: PropTypes.func,
        element: PropTypes.oneOfType([PropTypes.element, PropTypes.string])
    };

    static defaultProps = {
        data: null,
        onDrag: null,
        element: "div"
    };

    static contextTypes = {
        dragDropContext: dragDropContextShape
    };

    handleMouseDown = e => {
        if (this.props.onDrag) {
            this.props.onDrag(e, this.props.data);
        }
        // TODO: Allow cancelling the drag
        e.preventDefault();
        this.context.dragDropContext.beginDrag(e, this.props.data);
    };

    render() {
        const {
            children,
            data,
            element,
            element: Element,
            ...others
        } = this.props;
        return (
            <Element {...others} onMouseDown={this.handleMouseDown}>
                {children}
            </Element>
        );
    }
}
