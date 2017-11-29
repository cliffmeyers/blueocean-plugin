/* eslint-disable */
import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Card from './Card';

const style = {
    width: 400,
};

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

@DragDropContext(HTML5Backend)
export class Container extends Component {
    constructor(props) {
        super(props)
        this.moveCard = this.moveCard.bind(this);
        this.dropCard = this.dropCard.bind(this);
        this.state = {
            cards: [
                {
                    id: 1,
                    text: 'Write a cool JS library',
                },
                {
                    id: 2,
                    text: 'Make it generic enough',
                },
                {
                    id: 3,
                    text: 'Write README',
                },
                {
                    id: 4,
                    text: 'Create some examples',
                },
                {
                    id: 5,
                    text:
                        'Spam in Twitter and IRC to promote it (note that this element is taller than the others)',
                },
                {
                    id: 6,
                    text: '???',
                },
                {
                    id: 7,
                    text: 'PROFIT',
                },
            ],
        }
    }

    moveCard(originalIndex, hoverIndex) {
        console.log('new drag position! originalIndex', originalIndex, 'hoverIndex', hoverIndex);
    }

    dropCard(originalIndex, newIndex) {
        console.log('drop card', originalIndex, newIndex);
        const copy = transformData(this.state.cards, originalIndex, newIndex);

        if (copy) {
            this.setState({
                cards: copy,
            });
        }
    }

    renderList(cards) {

    }

    render() {
        const { cards } = this.state;

        return (
            <div style={style}>
                {cards.map((card, i) => (
                    <Card
                        key={card.id}
                        index={i}
                        id={card.id}
                        text={card.text}
                        moveCard={this.moveCard}
                        dropCard={this.dropCard}
                    />
                ))}
            </div>
        );
    }
}

export default Container;
