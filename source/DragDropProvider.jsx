import { Component } from "react";
import PropTypes from "prop-types";

function eventToCoords(event) {
    // TODO: Need touch support here
    return { x: event.pageX, y: event.pageY };
}

function getViewport() {
    return {
        left: window.pageXOffset || document.documentElement.scrollLeft || 0,
        top: window.pageYOffset || document.documentElement.scrollTop || 0,
        width: window.innerWidth,
        height: window.innerHeight
    };
}

export const dragDropContextShape = PropTypes.shape({
    isDragging: PropTypes.func.isRequired,
    beginDrag: PropTypes.func.isRequired
}).isRequired;

export default class DragDropProvider extends Component {
    static propTypes = {
        onDrop: PropTypes.func,
        children: PropTypes.element.isRequired,
        scrollNearViewportEdge: PropTypes.oneOf([
            "none",
            "both",
            "horizontal",
            "vertical"
        ])
    };

    static defaultProps = {
        onDrop: null,
        scrollNearViewportEdge: "both"
    };

    static childContextTypes = {
        dragDropContext: dragDropContextShape
    };

    state = {
        isDragging: false,
        dragData: null,
        dragComponent: null,
        startPosition: null,
        eventContext: null
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
        this.clearScrollInterval();
    }

    getEventContext(event) {
        const position = eventToCoords(event);
        const viewport = getViewport();
        return {
            movedX: position.x - this.state.startPosition.x,
            movedY: position.y - this.state.startPosition.y,
            viewLeft: position.x - viewport.left,
            viewRight: viewport.left + viewport.width - position.x,
            viewTop: position.y - viewport.top,
            viewBottom: viewport.top + viewport.height - position.y
        };
    }

    getScrollAmount(eventContext) {
        const scrollBleed = 50;
        const scrollSpeed = 500;
        const scroll = { x: 0, y: 0 };
        if (this.props.scrollNearViewportEdge !== "none") {
            const scrollAmount = value => {
                if (value >= scrollBleed) return 0;
                return (
                    (1 - Math.max(0, value) / scrollBleed) * scrollSpeed / 60
                );
            };
            if (
                this.props.scrollNearViewportEdge === "both" ||
                this.props.scrollNearViewportEdge === "horizontal"
            ) {
                const xn = scrollAmount(eventContext.viewLeft);
                const xp = scrollAmount(eventContext.viewRight);
                scroll.x = xn > xp ? -xn : xp;
            }
            if (
                this.props.scrollNearViewportEdge === "both" ||
                this.props.scrollNearViewportEdge === "vertical"
            ) {
                const yn = scrollAmount(eventContext.viewTop);
                const yp = scrollAmount(eventContext.viewBottom);
                scroll.y = yn > yp ? -yn : yp;
            }
        }
        return scroll;
    }

    setScrollInterval() {
        this.scrollInterval = setInterval(this.handleScroll, 1000 / 60);
    }

    clearScrollInterval() {
        if (this.scrollInterval) {
            clearInterval(this.scrollInterval);
        }
    }

    handleScroll = () => {
        const scroll = this.getScrollAmount(this.state.eventContext);
        // Stop scrolling when not near edge
        if (scroll.x === 0 && scroll.y === 0) {
            this.clearScrollInterval();
        }
        // Move by that amount; must trigger mouse move so the dragged element can be
        // positioned

        // const viewport = getViewport();
        window.scrollBy(scroll.x, scroll.y);
        /*
        this.setState(prevState => {
            eventContext: {
            }
        });
        */
    };

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
        const eventContext = this.getEventContext(e);
        if (this.props.onMove) {
            this.props.onMove(e, this.contextGetDragData(), eventContext);
        }
        if (this.state.dragComponent && this.state.dragComponent.props.onMove) {
            this.state.dragComponent.props.onMove(
                e,
                this.contextGetDragData(),
                eventContext
            );
        }
        this.setState({ eventContext }, () => {
            if (this.scrollInterval) {
                // Already scrolling
                return;
            }
            // Check if we need to scroll
            const scrollAmount = this.getScrollAmount(eventContext);
            if (scrollAmount.x !== 0 || scrollAmount.y !== 0) {
                // Start scrolling next frame
                this.setScrollInterval();
            }
        });
    };

    handleMouseUp = e => {
        this.unbindWindow();
        this.clearScrollInterval();
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
