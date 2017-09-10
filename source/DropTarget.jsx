import React, { Component } from "react";
import PropTypes from "prop-types";
import { dragDropContextShape } from "./DragDropProvider";

export default class DropTarget extends Component {
    static propTypes = {
        onOver: PropTypes.func.isRequired,
        onMove: PropTypes.func,
        onLeave: PropTypes.func
    };

    static defaultProps = {
        onMove: null,
        onLeave: null
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
        this.props.onOver(e, this.getDragData());
    };

    handleMouseLeave = e => {
        if (!this.context.dragDropContext.isDragging()) {
            return;
        }
        if (this.props.onLeave) {
            this.props.onLeave(e, this.getDragData());
        }
    };

    handleMouseMove = e => {
        if (!this.context.dragDropContext.isDragging()) {
            return;
        }
        if (this.props.onMove) {
            this.props.onMove(e, this.getDragData());
        }
    };

    handleMouseUp = e => {
        if (!this.context.dragDropContext.isDragging()) {
            return;
        }
        if (this.props.onDrop) {
            this.props.onDrop(e, this.getDragData());
        }
    };

    render() {
        const { children, onOver, onMove, onLeave, ...others } = this.props;
        // TODO: Touch support
        return (
            <div
                {...others}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
                onMouseMove={this.handleMouseMove}
                onMouseUp={this.handleMouseUp}
            >
                {children}
            </div>
        );
    }
}
