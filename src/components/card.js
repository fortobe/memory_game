import React, {Component} from 'react';

export default class Card extends Component {
    
    constructor(props) {
        super(props);
        this.state = {};
    }
    
    clicked(framework) {
        this.props.click(framework);
    }
    
    render() {
        return (
            <div className={'card' + (!this.props.closed ? ' opened' : '') + (this.props.matched ? ' matched' : '')}
                onClick={() => {this.clicked(this.props.card)}}
            >
                <div className="front"></div>
                <div className="back">
                    <img src={"/assets/img/" + this.props.card + '.png'} alt={this.props.card}/>
                </div>
            </div>
        );
    }
}