import React, { Component } from "react";
import PropTypes from "prop-types";
import { dragDropContextShape } from "./DragDropProvider";

export default class DropTarget extends Component {
    static propTypes = {
        data: PropTypes.any.isRequired,
        onOver: PropTypes.func.isRequired,
        onMove: PropTypes.func,
        onLeave: PropTypes.func,
        element: PropTypes.oneOfType([PropTypes.element, PropTypes.string])
    };

    static defaultProps = {
        data: null,
        onMove: null,
        onLeave: null,
        element: "div"
    };

    static contextTypes = {
        dragDropContext: dragDropContextShape
    };

    getDragData() {
        return this.context.dragDropContext.getDragData();
    }

    isDragging() {
        return this.context.dragDropContext.isDragging();
    }

    handleMouseEnter = e => {
        if (!this.isDragging()) {
            return;
        }
        this.props.onOver(e, this.props.data);
    };

    handleMouseLeave = e => {
        if (!this.context.dragDropContext.isDragging()) {
            return;
        }
        if (this.props.onLeave) {
            this.props.onLeave(e, this.props.data);
        }
    };

    handleMouseMove = e => {
        if (!this.context.dragDropContext.isDragging()) {
            return;
        }
        if (this.props.onMove) {
            this.props.onMove(e, this.props.data);
        }
    };

    handleMouseUp = e => {
        if (!this.context.dragDropContext.isDragging()) {
            return;
        }
        if (this.props.onDrop) {
            this.props.onDrop(e, this.props.data);
        }
    };

    render() {
        const {
            children,
            onOver,
            onMove,
            onLeave,
            element: Element,
            ...others
        } = this.props;
        // TODO: Touch support
        return (
            <Element
                {...others}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
                onMouseMove={this.handleMouseMove}
                onMouseUp={this.handleMouseUp}
            >
                {children}
            </Element>
        );
    }
}
