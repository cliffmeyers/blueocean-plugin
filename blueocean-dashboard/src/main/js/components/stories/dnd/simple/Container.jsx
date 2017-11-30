/* eslint-disable */
import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { CardList } from './CardList';
import { Card } from './Card';

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
                    children: [
                        {
                            id: 41,
                            text: 'Child 1'
                        }
                    ]
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

    moveCard(currentPosition) {
        console.log('moving! ', currentPosition);
        /*
        const cards = this.state.cards.slice();

        for (const card of cards) {
            if (card.id === currentPosition.id) {
                card.below = currentPosition.below;
                console.log('updating card.below to ', card.below);
                break;
            }
        }

        this.setState({
            cards
        });
        */
    }

    dropCard(currentPosition) {
        console.log('dropped', currentPosition);
        /*
        const copy = transformData(this.state.cards, originalIndex, newIndex);

        if (copy) {
            this.setState({
                cards: copy,
            });
        }
        */
    }

    render() {
        const { cards } = this.state;

        return (
            <div style={style}>
                <CardList
                    cards={cards}
                    moveCard={this.moveCard}
                    dropCard={this.dropCard}
                />
            </div>
        );
    }
}

export default Container;
