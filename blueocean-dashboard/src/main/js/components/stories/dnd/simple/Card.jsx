/* eslint-disable */
import React, { Component } from 'react';
import { PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import ItemTypes from './ItemTypes';

const style = {
    display: 'flex',
    justifyContent: 'space-between',
    border: '1px dashed gray',
    padding: '0.5rem 1rem',
    marginBottom: '.5rem',
    backgroundColor: 'white',
    cursor: 'move',
};

class ItemDragPosition {
    id = null;
    below = false;

    constructor(id, below) {
        this.id = id;
        this.below = below;
    }

    equals(position) {
        return position && this.id === position.id && this.below === position.below;
    }
}

function calculateVerticalDragPosition(component, clientOffset) {
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;
    const below = hoverClientY >= hoverMiddleY;
    return new ItemDragPosition(component.props.id, below);
}

function dragSourceCollector(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging: monitor.isDragging(),
        isHovering: false,
    };
}

function dropTargetCollector(connect, monitor) {
    const item = monitor.getItem() || {};

    return {
        connectDropTarget: connect.dropTarget(),
        isHovering: monitor.isOver(),
        hoverBelow: item && item.lastPosition && item.lastPosition.below,
        lastPosition: item && item.lastPosition,
    };
}


const cardSource = {
    beginDrag(props) {
        console.log('beginDrag', props);

        return {
            id: props.id,
            lastPosition: null,
        };
    },
};

const cardTarget = {
    hover(props, monitor, component) {
        const { lastPosition } = monitor.getItem();

        const currentPosition = calculateVerticalDragPosition(
            component,
            monitor.getClientOffset(),
        );

        if (currentPosition.equals(lastPosition)) {
            return;
        }

        props.moveCard(currentPosition);
        monitor.getItem().lastPosition = currentPosition;
    },
    drop(props, monitor) {
        const { lastPosition } = monitor.getItem();
        props.dropCard(lastPosition);
    }
};

@DragSource(ItemTypes.CARD, cardSource, dragSourceCollector)
@DropTarget(ItemTypes.CARD, cardTarget, dropTargetCollector)
class Card extends Component {
    static propTypes = {
        id: PropTypes.any.isRequired,
        text: PropTypes.string.isRequired,
        moveCard: PropTypes.func.isRequired,
        dropCard: PropTypes.func.isRequired,

        connectDragSource: PropTypes.func.isRequired,
        connectDragPreview: PropTypes.func,
        connectDropTarget: PropTypes.func.isRequired,
        isDragging: PropTypes.bool,
        isHovering: PropTypes.bool,
    };

    render() {
        const {
            text,
            isDragging,
            isHovering,
            connectDragSource,
            connectDragPreview,
            connectDropTarget,
        } = this.props;

        const opacity = isDragging ? 0 : 1;

        const divStyles = {
            ...style,
            opacity,
        };

        if (isHovering) {
            divStyles.backgroundColor = '#ccc';
        }

        return connectDragPreview(
            connectDropTarget(
                <div style={divStyles}>
                    <span>{text}</span>
                    {connectDragSource(<span>HH</span>)}
                </div>
            )
        );
    }
}

export { Card }
