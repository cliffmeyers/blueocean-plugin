/* eslint-disable */
import React from 'react';
import { findDOMNode } from 'react-dom'
import { storiesOf } from '@kadira/storybook';
import { DragDropContext, DragSource, DragTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import { List } from '@jenkins-cd/design-language';

import characters from './characters';


storiesOf('react-dnd', module)
    .add('Drag Divs', divStory)
    .add('Drag List', listStory)
    .add('Plain List', plainListStory)
;

const style = {
    border: '1px dashed gray',
    padding: '0.5rem 1rem',
    marginBottom: '.5rem',
    backgroundColor: 'white',
    cursor: 'move',
};

const cardSource = {
    beginDrag(props) {
        return {
            id: props.id,
            index: props.index,
        }
    },
};

const cardTarget = {
    hover(props, monitor, component) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;

        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
            return
        }

        // Determine rectangle on screen
        const hoverBoundingRect = findDOMNode(component).getBoundingClientRect()

        // Get vertical middle
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

        // Determine mouse position
        const clientOffset = monitor.getClientOffset();

        // Get pixels to the top
        const hoverClientY = clientOffset.y - hoverBoundingRect.top

        // Only perform the move when the mouse has crossed half of the items height
        // When dragging downwards, only move when the cursor is below 50%
        // When dragging upwards, only move when the cursor is above 50%

        // Dragging downwards
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
            return
        }

        // Dragging upwards
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
            return
        }

        // Time to actually perform the action
        props.moveItem(dragIndex, hoverIndex);

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        monitor.getItem().index = hoverIndex
    },
};


/*
@DragTarget('card', cardTarget, connect => ({
    connectDropTarget: connect.dropTarget(),
}))
@DragSource('card', cardSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
}))
*/
class DraggableListItem extends React.Component {
    render() {
        const {
            listItem,
            isDragging,
            connectDragSource,
            connectDropTarget,
        } = this.props;

        const id = listItem.toString();
        return connectDragSource(
            connectDropTarget(
                <div style={{...style}}>{id} {isDragging}</div>
            )
        );
    }
}

function PlainListItem(props) {
    return (
        <div>{props.listItem}</div>
    );
}

// @DragDropContext(HTML5Backend)
class ListComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: characters.slice(),
        }
    }

    moveItem = (dragIndex, hoverIndex) => {
        console.log('move');
    };

    render() {
        console.log('ListComponent.render', DragDropContext, DragSource, DragTarget);

        return (
            <List data={this.state.data}>
                { /* <DraggableListItem moveItem={this.moveItem} /> */ }
            </List>
        );
    }
}


function listStory() {
    // return DragDropContext(HTML5Backend)(ListComponent);
    return <ListComponent />;
}

/*
class DivComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            items: characters.slice(),
        }
    }
    render() {
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}
                        >
                            {this.state.items.map(item => {
                                const id = item.toString();
                                const content = item.toString();
                                return <Draggable key={id} draggableId={id}>
                                    {(provided, snapshot) => (
                                        <div>
                                            <div
                                                ref={provided.innerRef}
                                                style={getItemStyle(
                                                    provided.draggableStyle,
                                                    snapshot.isDragging
                                                )}
                                                {...provided.dragHandleProps}
                                            >
                                                {content}
                                            </div>
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Draggable>
                            })}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        );
    }
}
*/

function divStory() {
    return null;
}

function plainListStory() {
    return null;
    /*
    return (
        <List data={characters}>
            <PlainListItem style={getItemStyle({}, false)} />
        </List>
    );
    */
}
