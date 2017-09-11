import { Component } from "react";
import PropTypes from "prop-types";

function eventToCoords(event) {
    // TODO: Need touch support here
    return { x: event.pageX, y: event.pageY };
}

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
        dragData: null,
        dragComponent: null,
        startPosition: null
    };

    getChildContext() {
        return {
            dragDropContext: {
                isDragging: this.contextIsDragging,
                beginDrag: this.contextBeginDrag,
                getDragData: this.contextGetDragData,
                detachDragComponent: this.contextDetachDragComponent
            }
        };
    }

    componentWillUnmount() {
        // Unbind window events in case we unmounted during a drag
        // TODO: Probably trigger cancelDrag first
        this.unbindWindow();
    }

    getEventContext(event) {
        const position = eventToCoords(event);
        return {
            movedX: position.x - this.state.startPosition.x,
            movedY: position.y - this.state.startPosition.y
        };
    }

    contextIsDragging = () => this.state.isDragging;

    contextBeginDrag = (event, data, component) => {
        window.addEventListener("mousemove", this.handleMouseMove);
        window.addEventListener("mouseup", this.handleMouseUp);
        this.setState(
            {
                isDragging: true,
                dragData: data,
                dragComponent: component,
                startPosition: eventToCoords(event)
            },
            () => {
                if (
                    this.state.dragComponent &&
                    this.state.dragComponent.props.onDrag
                ) {
                    this.state.dragComponent.props.onDrag(
                        event,
                        this.contextGetDragData(),
                        { movedX: 0, movedY: 0 }
                    );
                }
            }
        );
    };

    contextGetDragData = () => this.state.dragData;

    contextDetachDragComponent = component => {
        if (this.state.dragComponent === component) {
            this.setState({ dragComponent: null });
        }
    };

    unbindWindow() {
        window.removeEventListener("mousemove", this.handleMouseMove);
        window.removeEventListener("mouseup", this.handleMouseUp);
    }

    handleMouseMove = e => {
        // Call the move handler
        if (this.props.onMove) {
            this.props.onMove(
                e,
                this.contextGetDragData(),
                this.getEventContext(e)
            );
        }
        if (this.state.dragComponent && this.state.dragComponent.props.onMove) {
            this.state.dragComponent.props.onMove(
                e,
                this.contextGetDragData(),
                this.getEventContext(e)
            );
        }
    };

    handleMouseUp = e => {
        this.unbindWindow();
        // Call the drop handler
        if (this.props.onDrop) {
            this.props.onDrop(
                e,
                this.contextGetDragData(),
                this.getEventContext(e)
            );
        }
        this.setState({
            isDragging: false,
            dragData: null,
            dragComponent: null,
            startPosition: null
        });
    };

    render() {
        return this.props.children;
    }
}
