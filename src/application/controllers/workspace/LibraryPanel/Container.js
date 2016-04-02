/*
 * Copyright 2015 Alexander Pustovalov
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { forOwn, isObject } from 'lodash';
import { modelSelector } from './selectors.js';
import { containerActions } from './actions.js';

import { Button, Input } from 'react-bootstrap';

class Container extends Component {

    constructor(props) {
        super(props);
        this.state = { filer: '' };
        this.handleChangeFind = this.handleChangeFind.bind(this);
        this.handleClearFind = this.handleClearFind.bind(this);
        this.handleOnKeyDown = this.handleOnKeyDown.bind(this);
    }

    componentDidMount() {
        //$(React.findDOMNode(this)).find('.panel-body').remove();
    }

    componentDidUpdate() {
        //$(React.findDOMNode(this)).find('.panel-body').remove();
    }

    componentWillUpdate(nextProps, nextState) {
        //PopoverComponentVariantActions.hide();
    }

    componentWillUnmount() {
    }

    handleChangeFind(e) {
        var value = this.refs.inputElement.value;
        var newState = {
            filter: value
        };
        this.setState(newState);
    }

    handleOnKeyDown(e) {
        if (e.keyCode == 27) {
            this.handleClearFind(e);
        }
    }

    handleClearFind(e) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({filter: ''});
    }

    makeTitle(componentName){
        let titleComponentName = componentName;
        if(titleComponentName.length > 20){
            titleComponentName = titleComponentName.substr(0, 20) + '...';
        }
        return titleComponentName;
    }

    render() {

        const { componentModel: {componentsTree : componentTreeModel, componentInPreview}, previewComponent } = this.props;
        const { filter } = this.state;

        const style = {
            position: 'relative',
            width: '100%',
            marginTop: '5px'
        };

        let libGroups = [];
        let groupHeaderKey = 0;
        let counter = 0;

        const filterString = filter ? filter.toUpperCase() : null;
        console.log('Component in preview: ' + componentInPreview);
        forOwn(componentTreeModel, (group, groupName) => {
            if(isObject(group)){
                let components = [];
                forOwn(group, (componentTypeValue, componentName) => {
                    if(filter){
                        if(componentName.toUpperCase().includes(filterString)){
                            components.push(
                                <a key={componentName}
                                   className={componentInPreview === componentName ? 'list-group-item active' : 'list-group-item'}
                                   href="#"
                                   onClick={(e) => {e.preventDefault(); e.stopPropagation(); previewComponent(componentName);}}>
                                    <span>{this.makeTitle(componentName)}</span>
                                </a>
                            );
                        }
                    } else {
                        components.push(
                            <a key={componentName}
                               className={componentInPreview === componentName ? 'list-group-item active' : 'list-group-item'}
                               href="#"
                               onClick={(e) => {e.preventDefault(); e.stopPropagation(); previewComponent(componentName);}}>
                                <span>{this.makeTitle(componentName)}</span>
                            </a>
                        );
                    }
                });
                let key = '' + ++groupHeaderKey;
                if(components.length > 0){
                    let keySuffix = filter ? '12' : '0';
                    let id = 'group' + groupName + counter + keySuffix;
                    let collapsed = !!filter ? "in" : "";
                    libGroups.push(
                        <div key={key}
                             className="panel panel-default">
                            <div className="panel-heading"
                                 role="tab"
                                 id="headingOne">
                                <a style={{outline: '0'}}
                                   role="button"
                                   data-toggle="collapse"
                                   href={'#' + id}
                                   aria-expanded="true"
                                   aria-controls={id}>
                                    {groupName}
                                </a>
                            </div>
                            <div id={id}
                                 className={"panel-collapse collapse " + collapsed}
                                 role="tabpanel"
                                 aria-labelledby={id}>
                                <div className="list-group">
                                    {components}
                                </div>
                                <div style={{height: '0'}}></div>
                            </div>
                        </div>
                    );
                }
            }
            counter++;
        });

        return (
            <div style={{paddingTop: '5px'}}>
                <div className="input-group input-group-sm">
                    <input
                        ref='inputElement'
                        type="text"
                        className="form-control"
                        placeholder="Filter..."
                        value={this.state.filter}
                        onKeyDown={this.handleOnKeyDown}
                        onChange={this.handleChangeFind} />
                    <span className="input-group-btn">
                        <button
                            className="btn btn-default"
                            type="button"
                            onClick={this.handleClearFind}>
                            <span className='fa fa-times'></span>
                        </button>
                    </span>
                </div>
                <div ref='container' style={style}>
                    <div
                        className="panel-group"
                        id="accordion"
                        role="tablist"
                        aria-multiselectable="true"
                        ref="panelGroup">
                        {libGroups}
                    </div>
                </div>
            </div>
        );
    }

}

export default connect(modelSelector, containerActions)(Container);