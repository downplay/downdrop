import React, { Component } from "react";
import PropTypes from "prop-types";

import { dragDropContextShape } from "./DragDropProvider";

export default class DragHandle extends Component {
    static propTypes = {
        data: PropTypes.any,
        onDrag: PropTypes.func,
        onMove: PropTypes.func,
        element: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
    };

    static defaultProps = {
        data: null,
        onDrag: null,
        onMove: null,
        element: "div"
    };

    static contextTypes = {
        dragDropContext: dragDropContextShape
    };

    componentWillUnmount() {
        this.context.dragDropContext.detachDragComponent(this);
    }

    handleMouseDown = e => {
        // TODO: Allow cancelling the drag
        e.preventDefault();
        this.context.dragDropContext.beginDrag(e, this.props.data, this);
    };

    render() {
        const {
            children,
            data,
            onMove,
            onDrag,
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
