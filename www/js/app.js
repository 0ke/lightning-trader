import React from 'react';

// Comment out for mock client-side feed
import * as feed from './services/feed-mock';

// Comment out for real socket.io feed
// import * as feed from './services/feed-socketio';

import Header from './modules/Header';
import StockGrid from './modules/StockGrid';
import BuyWindow from './modules/BuyWindow';
import SellWindow from './modules/SellWindow';

let App = React.createClass({

    getInitialState() {
        var stocks = {};
        feed.watch(['MCD', 'BA', 'BAC', 'LLY', 'GM', 'GE', 'UAL', 'WMT', 'AAL', 'JPM']);
        feed.onChange(stock => {
            stocks[stock.symbol] = stock;
            this.setState({stocks: stocks, last: stock});
        });
        return {stocks: stocks, sort: "symbol"};
    },
    buyHandler(stock) {
        this.setState({buyWindow:stock});
    },
    sellHandler(stock) {
        this.setState({sellWindow:stock});
    },
    closeWindowHandler() {
        this.setState({buyWindow: false, sellWindow: false});
    },
    watch(symbols) {
        symbols = symbols.replace(/ /g,'');
        var arr = symbols.split(",");
        feed.watch(arr);
    },
    removeHandler(stock) {
        feed.unwatch(stock.symbol);
        var stocks = this.state.stocks;
        delete stocks[stock.symbol];
        this.setState({stocks: stocks});
    },
    sortHandler(value, label) {

    },

    render() {
        return (
            <div>
                <Header type="Portfolio" title="Diversified Tech" itemCount="10" newLabel="New Portfolio"
                        viewOptions={[{value:"grid", label:"Grid", icon: "table"}]}
                        sortOptions={[{value:"symbol", label:"Symbol"},{value:"open", label:"Open"},{value:"last", label:"Last"},{value:"change", label:"Change"},{value:"high", label:"High"},{value:"low", label:"Low"}]}
                        onSort={this.sortHandler}/>
                <StockGrid stocks={this.state.stocks} last={this.state.last}
                           onBuy={this.buyHandler}
                           onSell={this.sellHandler}
                           onRemove={this.removeHandler}/>
                {this.state.buyWindow ? <BuyWindow onSave={this.saveHandler} onSave={this.closeWindowHandler} onCancel={this.closeWindowHandler} stock={this.state.buyWindow}/> : ""}
                {this.state.sellWindow ? <SellWindow onSave={this.saveHandler} onSave={this.closeWindowHandler} onCancel={this.closeWindowHandler} stock={this.state.sellWindow}/> : ""}
            </div>
        );
    }
});

React.render(<App />, document.body);