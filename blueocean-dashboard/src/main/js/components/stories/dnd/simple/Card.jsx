/* eslint-disable */
import React, { Component } from 'react';
import { PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import ItemTypes from './ItemTypes';

const style = {
    border: '1px dashed gray',
    padding: '0.5rem 1rem',
    marginBottom: '.5rem',
    backgroundColor: 'white',
    cursor: 'move',
};

const cardSource = {
    beginDrag(props) {
        console.log('beginDrag', props);
        return {
            id: props.id,
            originalIndex: props.index,
            lastDraggedIndex: props.index,
        };
    },
};

const cardTarget = {
    hover(props, monitor, component) {
        const { originalIndex, lastDraggedIndex } = monitor.getItem();
        const hoverIndex = props.index;

        // Don't replace items with themselves
        if (originalIndex === hoverIndex) {
            return
        }

        if (hoverIndex === lastDraggedIndex) {
            return;
        }

        // Determine rectangle on screen
        const hoverBoundingRect = findDOMNode(component).getBoundingClientRect()

        // Get vertical middle
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

        // Determine mouse position
        const clientOffset = monitor.getClientOffset()

        // Get pixels to the top
        const hoverClientY = clientOffset.y - hoverBoundingRect.top

        // Only perform the move when the mouse has crossed half of the items height
        // When dragging downwards, only move when the cursor is below 50%
        // When dragging upwards, only move when the cursor is above 50%

        // Dragging downwards
        if (originalIndex < hoverIndex && hoverClientY < hoverMiddleY) {
            return;
        }

        // Dragging upwards
        if (originalIndex > hoverIndex && hoverClientY > hoverMiddleY) {
            return;
        }

        // Time to actually perform the action
        props.moveCard(originalIndex, hoverIndex);

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        monitor.getItem().lastDraggedIndex = hoverIndex;
    },
    drop(props, monitor) {
        const { originalIndex, lastDraggedIndex } = monitor.getItem();
        props.dropCard(originalIndex, lastDraggedIndex);
    }
}

@DropTarget(ItemTypes.CARD, cardTarget, connect => ({
    connectDropTarget: connect.dropTarget(),
}))
@DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
}))
export default class Card extends Component {
    static propTypes = {
        connectDragSource: PropTypes.func.isRequired,
        connectDropTarget: PropTypes.func.isRequired,
        index: PropTypes.number.isRequired,
        isDragging: PropTypes.bool.isRequired,
        id: PropTypes.any.isRequired,
        text: PropTypes.string.isRequired,
        moveCard: PropTypes.func.isRequired,
        dropCard: PropTypes.func.isRequired,
    }

    render() {
        const {
            text,
            isDragging,
            connectDragSource,
            connectDropTarget,
        } = this.props
        const opacity = isDragging ? 0 : 1

        return connectDragSource(
            connectDropTarget(<div style={{ ...style, opacity }}>{text}</div>),
        )
    }
}
