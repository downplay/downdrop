import React, { Component } from "react";
import PropTypes from "prop-types";

import { dragDropContextShape } from "./DragDropProvider";

export default class DragHandle extends Component {
    static propTypes = {
        onDrag: PropTypes.func,
        data: PropTypes.any.isRequired
    };

    static defaultProps = {
        onDrag: null
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
        const { children, data, ...others } = this.props;
        return (
            <div {...others} onMouseDown={this.handleMouseDown}>
                {children}
            </div>
        );
    }
}
