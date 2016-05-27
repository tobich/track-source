import React from 'react';
import Ace from 'react-ace';
import ReactDOM from 'react-dom';

const babel = require('babel-core');
import plugin from '../lib/plugin';
const brace = require('brace');
const Range = brace.acequire('ace/range').Range;

import preset1 from 'raw!./preset-file-1';

function transpile(source) {
    return babel.transform(source, {
        plugins: [plugin]
    }).code;
}

const style = {
    button1: {
        margin: 10,
        border: '1px solid darkgreen',
        background: 'green'
    }
};

let events = [];

function heartBeat() {
    if(events.length>0) {
        const newEvent = events.shift();
        newEvent();
    }
    setTimeout(heartBeat, 250);
}
setTimeout(heartBeat, 0);

class Playground extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            code: preset1
        }
    }

    runCode(code) {
        events = [];
        const __track__ = (start, end, line) => {
            events.push(function () {
                if(this.markerId) {
                    this.refs.editor.editor.session.removeMarker(this.markerId);
                }
                this.markerId = this.refs.editor.editor.session.addMarker(new Range(line-1,0,line-1,100), 'ace_selection', 'fullLine');
            }.bind(this));
        };
        let compiledCode;
        try {
            compiledCode = transpile(code);
            eval(compiledCode);
        } catch (err) {}
    }

    onChange(code) {
        events = [];
        this.runCode(code);
        this.setState({
            code
        });
    }

    componentDidMount() {
        this.editor = ReactDOM.findDOMNode(this.refs.editor);
        this.editor.focus();
        this.runCode(this.state.code);
    }

    render() {
        return (
            <div>
                <Ace ref="editor" value={this.state.code} mode="javascript" theme="github" onChange={this.onChange.bind(this)}/>
                <div style={style.button1} id="button1">Button1 1</div>
            </div>
        );
    }
}

ReactDOM.render(<Playground/>, document.querySelector('#playground'));