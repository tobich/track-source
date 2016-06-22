import React from 'react';
import Ace from 'react-ace';
import ReactDOM from 'react-dom';
import {Tabs, Tab} from 'material-ui/Tabs';
import RaisedButton from 'material-ui/RaisedButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();


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
    'console': {
        position: 'fixed',
        width: '100%',
        height: '33vh',
        bottom: 0,
        zIndex: 999,
        background: 'white'
    }
};

let events = [];

class Playground extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            code: preset1
        }
    }

    heartBeat() {
        if (events.length > 0) {
            const newEvent = events.shift();
            newEvent();
        } else {
            if(this.markerId) {
                this.refs.editor.editor.session.removeMarker(this.markerId);
                this.markerId = null;
            }
        }
        setTimeout(this.heartBeat.bind(this), 200);
    }

    runCode(code) {
        events = [];
        const __track__ = line => {
            events.push(function () {
                if (this.markerId) {
                    this.refs.editor.editor.session.removeMarker(this.markerId);
                }
                this.markerId = this.refs.editor.editor.session.addMarker(new Range(line - 1, 0, line - 1, 100), 'ace_selection', 'fullLine');
            }.bind(this));
        };
        let compiledCode;
        try {
            compiledCode = transpile(code);
        } catch(err) {
            return;
        }
        try {
            eval(compiledCode);
        } catch (err) {
        }

        this.setState({
            code
        });
    }

    onChange(code) {
        events = [];
        this.runCode(code);
    }

    componentDidMount() {
        this.editor = ReactDOM.findDOMNode(this.refs.editor);
        this.editor.focus();
        this.runCode(this.state.code);
        this.heartBeat();
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme()}>
                <div>
                    <Tabs>
                        <Tab label="Source">
                            <Ace ref="editor"
                                 value={this.state.code}
                                 mode="javascript"
                                 theme="github"
                                 onChange={this.onChange.bind(this)}
                                 width="100%"
                                 height="100vh"
                            />
                        </Tab>
                        <Tab label="Target">
                            <pre>{transpile(this.state.code).replace(/\n+/g, '\n')}</pre>
                        </Tab>
                    </Tabs>
                    <div style={style.console}>
                        <RaisedButton label="Button 1" secondary="{true}" id="button1"/>
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
}

ReactDOM.render(<Playground/>, document.querySelector('#playground'));