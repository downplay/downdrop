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
        ]),
        scrollProximity: PropTypes.number,
        scrollSpeed: PropTypes.number,
        minimumDragDistance: PropTypes.number
    };

    static defaultProps = {
        onDrop: null,
        scrollNearViewportEdge: "both",
        scrollProximity: 100,
        scrollSpeed: 1200,
        minimumDragDistance: 3
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
            pageX: position.x,
            pageY: position.y,
            movedX: position.x - this.state.startPosition.x,
            movedY: position.y - this.state.startPosition.y,
            viewLeft: position.x - viewport.left,
            viewRight: viewport.left + viewport.width - position.x,
            viewTop: position.y - viewport.top,
            viewBottom: viewport.top + viewport.height - position.y
        };
    }

    getScrollAmount(eventContext) {
        const scroll = { x: 0, y: 0 };
        const { scrollProximity, scrollSpeed } = this.props;

        if (this.props.scrollNearViewportEdge !== "none") {
            const viewport = getViewport();
            const scrollAmount = value => {
                if (value >= scrollProximity) return 0;
                return Math.ceil(
                    (1 - Math.max(0, value) / scrollProximity) *
                        scrollSpeed /
                        60
                );
            };
            if (
                this.props.scrollNearViewportEdge === "both" ||
                this.props.scrollNearViewportEdge === "horizontal"
            ) {
                // Work out x scroll, don't scroll over existing bounds
                const xn = Math.min(
                    viewport.left,
                    scrollAmount(eventContext.viewLeft)
                );
                const xp = Math.min(
                    document.documentElement.scrollWidth -
                        viewport.width -
                        viewport.left,
                    scrollAmount(eventContext.viewRight)
                );
                scroll.x = xn > xp ? -xn : xp;
            }
            if (
                this.props.scrollNearViewportEdge === "both" ||
                this.props.scrollNearViewportEdge === "vertical"
            ) {
                // Work out y scroll, don't scroll over existing bounds
                const yn = Math.min(
                    viewport.top,
                    scrollAmount(eventContext.viewTop)
                );
                const yp = Math.min(
                    document.documentElement.scrollHeight -
                        viewport.height -
                        viewport.top,
                    scrollAmount(eventContext.viewBottom)
                );
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
            delete this.scrollInterval;
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
        // TODO: Support a custom scroll element instead of window, and custom scrollbars
        window.scrollBy(scroll.x, scroll.y);
        // Using a fake move event to update state and let the element move with the cursor
        this.handleMouseMove({
            pageX: this.state.eventContext.pageX + scroll.x,
            pageY: this.state.eventContext.pageY + scroll.y
        });
    };

    contextIsDragging = () => this.state.isDragging;

    contextBeginDrag = (event, data, component) => {
        // Cancel default event otherwise the mouse starts selecting things
        // TODO: Not really ideal. Could cancel stuff we don't otherwise want to cancel.
        // Maybe better to let the user deal with how to prevent strange artifacts?
        event.preventDefault();
        // Set up events
        window.addEventListener("mousemove", this.handleMouseMove);
        window.addEventListener("mouseup", this.handleMouseUp);
        this.setState({
            isDragging: false,
            dragData: data,
            dragComponent: component,
            startPosition: eventToCoords(event)
        });
        // Start drag straight away if no min drag distance
        if (this.props.minimumDragDistance === 0) {
            this.beginDrag(event, data, component, { movedX: 0, movedY: 0 });
        }
    };

    beginDrag(e, data, component, context) {
        if (component && component.props.onDrag) {
            component.props.onDrag(e, data, context);
        }
        this.setState({
            isDragging: true
        });
    }

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
        // Get coords from event
        const eventContext = this.getEventContext(e);
        // Has drag really started yet?
        if (!this.state.isDragging) {
            const { dragComponent, dragData } = this.state;
            if (
                Math.abs(eventContext.movedX) >=
                    this.props.minimumDragDistance ||
                Math.abs(eventContext.movedY) >= this.props.minimumDragDistance
            ) {
                // Actually dragging now
                this.beginDrag(e, dragData, dragComponent, eventContext);
            }
            return;
        }
        // Call the move handler
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
        if (this.props.onDrop && this.state.isDragging) {
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
