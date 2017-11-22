/* eslint-disable */
import React from 'react';
import { storiesOf } from '@kadira/storybook';

import characters from './characters';
import { List } from '@jenkins-cd/design-language';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';


storiesOf('react-beautiful-dnd', module)
    .add('Drag Divs', divStory)
    .add('Drag List', listStory)
    .add('Plain List', plainListStory)
;

function transformData(data, sourceIndex, targetIndex) {
    if (sourceIndex !== targetIndex) {
        console.log(`move ${sourceIndex} to ${targetIndex}`);
        const copy = data.slice();
        const sourceItem = copy[sourceIndex];
        copy.splice(sourceIndex, 1);
        copy.splice(targetIndex, 0, sourceItem);
        return copy;
    }

    return false;
}

function getListStyle(isDraggingOver) {
    return {
        width: 400,
        margin: 20,
        background: isDraggingOver ? 'lightblue' : 'white',
    };
}

function getItemStyle(draggableStyle, isDragging) {
    return {
        padding: 5,
        background: isDragging ? 'lightgreen' : 'transparent',
        ...draggableStyle
    }
}

function DraggableListItem(props) {
    const id = props.listItem.toString();
    return (
        <Draggable key={id} draggableId={id}>
            { (provided, snapshot) => {
                const handleProps = provided.dragHandleProps;
                delete handleProps.tabIndex;
                return (
                <div>
                    <div
                        ref={provided.innerRef}
                        style={getItemStyle(provided.draggableStyle, snapshot.isDragging)}
                        {...handleProps}
                    >
                        {props.listItem}
                    </div>
                    {provided.placeholder}
                </div>
                );
            }}
        </Draggable>
    )
}

function PlainListItem(props) {
    return (
        <div>{props.listItem}</div>
    );
}

class ListComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: characters,
        }
    }

    onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        const sourceIndex = result.source.index;
        const targetIndex = result.destination.index;

        const changed = transformData(this.state.data, sourceIndex, targetIndex);

        if (changed) {
            this.setState({
                data: changed,
            });
        }
    };

    render() {
        console.log('ListComponent.render');

        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="droppable">
                    { (provided, snapshot ) => (
                        <div
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}
                        >
                            <List data={this.state.data} defaultStyles={false}>
                                <DraggableListItem />
                            </List>
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        );
    }
}


function listStory() {
    return <ListComponent />;
}


class DivComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            items: characters.slice(),
        }
    }

    onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        const sourceIndex = result.source.index;
        const targetIndex = result.destination.index;

        const changed = transformData(this.state.items, sourceIndex, targetIndex);

        if (changed) {
            this.setState({
                items: changed,
            });
        }
    };

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
                                    {(provided, snapshot) => {
                                        const handleProps = provided.dragHandleProps;
                                        delete handleProps.tabIndex;
                                        return (
                                        <div>
                                            <div
                                                ref={provided.innerRef}
                                                style={getItemStyle(
                                                    provided.draggableStyle,
                                                    snapshot.isDragging
                                                )}
                                                {...handleProps}
                                            >
                                                {content}
                                            </div>
                                            {provided.placeholder}
                                        </div>
                                        )
                                    }}
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

function divStory() {
    return <DivComponent />;
}

function plainListStory() {
    return (
        <List data={characters}>
            <PlainListItem style={getItemStyle({}, false)} />
        </List>
    );
}
