import React from 'react';
import { PropTypes } from 'react';
import { Card } from './Card';


class CardList extends React.Component {

    static propTypes = {
        cards: PropTypes.array.isRequired,
        nestingLevel: PropTypes.number,
        moveCard: PropTypes.func.isRequired,
        dropCard: PropTypes.func.isRequired,
    };

    static defaultProps = {
        nestingLevel: 0,
    };

    render() {
        const { cards, nestingLevel, moveCard, dropCard } = this.props;

        return (
            <div style={{ marginLeft: 20 * nestingLevel}}>
                <h1>Card List</h1>

                {cards.map((card, i) => {
                    return [
                        <Card
                            key={card.id}
                            index={i}
                            id={card.id}
                            text={card.text}
                            below={card.below}
                            moveCard={moveCard}
                            dropCard={dropCard}
                        />,

                        card.children && card.children.length &&
                        <CardList
                            cards={card.children}
                            nestingLevel={nestingLevel + 1}
                            moveCard={moveCard}
                            dropCard={dropCard}
                        />
                    ];
                })}
            </div>
        );
    }
}

export { CardList };
