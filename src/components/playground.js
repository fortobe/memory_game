import React, {Component} from 'react';
import Card from './card';

export default class Playground extends Component {

    constructor(props) {
        super(props);
        let cardList = ['anteater','bear','beaver','boar','brownbear','bull','camel','chameleon','cheetah','crocodile','deer','donkey','duck','eagle','elephant','elk','fox','frog','giraffe','goat','goat2','goose','gorilla','hamster','hedgehog','hippo','horse','kangaroo','koala','lemur','lion','llama','meerkat','monkey','ostrich','owl','panda','parrot','penguin','puma','rabbit','raccoon','rhinoceros','sloth','snake','tiger','turtle','walrus','wolf','zebra',];
        let count, rem, c = window.confirm('Choose animals amount?');
        if (c) {
            do {
                count = Math.floor(+prompt('Animals amount (3 to 50)', '18'));
            } while(isNaN(count) || count < 3 || count > 50);
            if (rem = count % 3) {
                count = count + (3 - rem);
                if (count > 50) count = 50;
            }
        } else count = 18;
        this.state = {
            rawlist: this.shuffle(cardList).slice(0, count),
            cards: [],
            selected: [],
            matched: 0,
            finished: false,
            timer: {
                hours: '00',
                minutes: '00',
                seconds: '00',
            },
            moves: 0,
            leaders: [],
            count: count,
        };
        this.init();
    }

    handleClick(name, index) {
        if (this.state.selected.length === 2) return false;
        let card = {
            name,
            index,
        };
        let cards = this.state.cards;
        if (!cards[index].closed) return false;
        let selected = this.state.selected;
        cards[index].closed = false;
        selected.push(card);
        this.setState({
            selected: selected,
            cards: cards,
            moves:  this.state.moves + 1,
        });
        if (this.state.selected.length === 2) {
            clearTimeout(this.state.cardtime);
            setTimeout(() => {
                this.check();
            }, 750);
        } else {
            this.setState({
                cardtime: setTimeout(() => {
                    cards[index].closed = true;
                    this.setState({
                        selected: [],
                        cards: cards,
                    })
                }, 5000),
            });
        }
    }

    check() {
        let cards = this.state.cards;
        let isMatch = this.state.selected[0].name === this.state.selected[1].name &&
            this.state.selected[0].index !== this.state.selected[1].index;
        let matched = this.state.matched;
        if (isMatch) matched += 2;
        this.state.selected.forEach(e => {
            cards[e.index][isMatch ? 'matched' : 'closed'] = true;
        });
        this.setState({
            selected: [],
            cards: cards,
            matched: matched,
        });
        if (matched === this.state.cards.length) {
            clearInterval(this.state.timerID);
            this.setState({
                finished: true,
            });
            let time = new Date(Date.now() - this.state.timerBegin);
            let players = localStorage.getItem('players:'+this.state.count);
            if (!players) players = {};
            else players = JSON.parse(players);
            let ftime = `${String(time.getUTCHours()).replace(/^(\d)$/, '0$1')}:${String(time.getMinutes()).replace(/^(\d)$/, '0$1')}:${String(time.getSeconds()).replace(/^(\d)$/, '0$1')}`;
            let player = players[this.state.player] || {
                name: this.state.player,
                time: time.getTime(),
                moves: this.state.moves,
                ftime: ftime,
            };
            player.moves = this.state.moves;
            player.time = time;
            player.ftime = ftime;
            players[player.name] = player;
            let leaders = Object.values(players).sort((a, b) => {
                if (a.moves > b.moves) return 1;
                if (a.moves < b.moves) return -1;
                if (a.time > b.time) return 1;
                if (a.time < b.time) return -1;
                if (a.name > b.name) return 1;
                if (a.name < b.name) return -1;
                return 0;
            }).slice(0, 10);
            this.setState({
                leaders: leaders,
            });
            localStorage.setItem('players:'+this.state.count, JSON.stringify(players));
        }
    }

    init() {
        do {
            this.state.player = prompt('What is your name?');
        } while (!this.state.player);
        let cards = [];
        let finalList = this.state.rawlist.concat(this.state.rawlist);
        let randomized = this.shuffle(finalList);
        randomized.forEach( name => {
            cards.push({
                name,
                closed: true,
                matched: false,
            });
        });
        this.state.cards = cards;
        this.state.timerBegin = Date.now();
        this.state.timerID = setInterval(() => {
            let now = new Date(Date.now() - this.state.timerBegin);
            this.setState({
                timer: {
                    hours: String(now.getUTCHours()).replace(/^(\d)$/, '0$1'),
                    minutes: String(now.getMinutes()).replace(/^(\d)$/, '0$1'),
                    seconds: String(now.getSeconds()).replace(/^(\d)$/, '0$1'),
                },
            });
        }, 1000);
    }

    shuffle(arr) {
        let curi = arr.length, temp, randi;
        while (0 !== curi) {
            randi = Math.floor(Math.random() * curi);
            --curi;
            temp = arr[curi];
            arr[curi] = arr[randi];
            arr[randi] = temp;
        }
        return arr;
    }

    render() {
        return  (
            <div id="game" className={this.state.finished ? 'finished' : ''}>
                <div className="playground">
                    {
                        this.state.cards.map((card, index) => <Card
                            key={index}
                            card={card.name}
                            click={() => {this.handleClick(card.name, index)}}
                            closed={card.closed}
                            matched={card.matched}
                        />)
                    }
                </div>
                <div id="timer">
                    <div><b>Player:</b> {this.state.player}</div>
                    <div><b>Moves:</b> {this.state.moves}</div>
                    <div><b>Time:</b> {this.state.timer.hours}:{this.state.timer.minutes}:{this.state.timer.seconds}</div>
                </div>
                <div className="leaderboard">
                    <h1>Leaderboard (TOP 10):</h1>
                    <ol>
                        {this.state.leaders.map(e => <li key={e.name} className={e.name === this.state.player ? 'current' : ''}><b>{e.name}:</b> {e.moves} moves ({e.ftime})</li>)}
                    </ol>
                    <button type="button" onClick={() => window.location.reload()}>Play again</button>
                </div>
            </div>
        );
    }
}