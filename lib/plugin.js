

module.exports = function (babel) {
    const t = babel.types;

    function getPosition(path) {
        if(path.isIfStatement()) {
            return {
                start: path.node.start,
                end: path.node.consequent.start - 1
            };
        } else if(path.isForStatement()) {
            return {
                start: path.node.start,
                end: path.node.body.start - 1
            };
        } else {
            return {
                start: path.node.start,
                end: path.node.end
            };
        }
    }

    function wrapStatement(path) {
        const position = getPosition(path);
        const line = path.node.loc.start.line;
        path.insertBefore(
            t.ExpressionStatement(
                t.CallExpression(
                    t.Identifier('__track__'),
                    [
                        t.NumericLiteral(position.start),
                        t.NumericLiteral(position.end),
                        t.NumericLiteral(line)
                    ]
                )
            )
        );
    }

    function wrapBody(path) {
        path.get('body').forEach(wrapStatement);
    }

    return {
        visitor: {
            Program: wrapBody,
            BlockStatement: wrapBody
        }
    }
};