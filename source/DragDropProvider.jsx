import { Component } from "react";
import PropTypes from "prop-types";

export const dragDropContextShape = PropTypes.shape({
    isDragging: PropTypes.func.isRequired,
    beginDrag: PropTypes.func.isRequired
}).isRequired;

export default class DragDropProvider extends Component {
    static propTypes = {
        onDrop: PropTypes.func
    };

    static defaultProps = {
        onDrop: null
    };

    static childContextTypes = {
        dragDropContext: dragDropContextShape
    };

    state = {
        isDragging: false,
        dragData: null
    };

    getChildContext() {
        return {
            dragDropContext: {
                isDragging: this.contextIsDragging,
                beginDrag: this.contextBeginDrag,
                getDragData: this.contextGetDragData
            }
        };
    }

    componentWillUnmount() {
        // Unbind window events in case we unmounted during a drag
        // TODO: Probably trigger cancelDrag first
        this.unbindWindow();
    }

    contextIsDragging = () => this.state.isDragging;

    contextBeginDrag = (event, data) => {
        window.addEventListener("mousemove", this.handleMouseMove);
        window.addEventListener("mouseup", this.handleMouseUp);
        this.setState({ isDragging: true, dragData: data });
    };

    contextGetDragData = () => this.state.dragData;

    unbindWindow() {
        window.removeEventListener("mousemove", this.handleMouseMove);
        window.removeEventListener("mouseup", this.handleMouseUp);
    }

    handleMouseMove = () => {};

    handleMouseUp = () => {
        this.unbindWindow();
        // Call the drop handler
        if (this.props.onDrop) {
            this.props.onDrop(this.contextGetDragData());
        }
        this.setState({ isDragging: false, dragData: null });
    };

    render() {
        return this.props.children;
    }
}
