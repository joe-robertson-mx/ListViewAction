import React, { Component, ReactNode, createElement} from "react";
import classNames from "classnames";

// import { Alert } from "./Shared/components/Alert";
import { DataSourceHelper } from "./Shared/DataSourceHelper/DataSourceHelper";
import { SharedUtils, WrapperProps } from "./Shared/SharedUtils";

import { Button } from "./Action/components/Button";
import { Validate } from "./Validate";
import { SharedContainerUtils } from "./Shared/SharedContainerUtils";
import { Link } from "./Action/components/Link";

export interface ContainerProps extends WrapperProps {
    entity: string;
    microflow: string;
    btnText: string,
    btnGlyph: string|null,
    btn: boolean
}


export interface ContainerState {
    listViewAvailable: boolean;
    alertMessage?: ReactNode;
}

interface ListObject {
    _guid: string;
}


export default class SearchContainer extends Component<ContainerProps, ContainerState> {
    private dataSourceHelper?: DataSourceHelper;
    private widgetDom: Element | null = null;
    private retriesFind = 0;

    constructor(props: ContainerProps) {
        super(props);
        this.state = {
            listViewAvailable: false
        };

    }

    render() {
        return createElement("div", { //this create element is unnecessary and can be removed
                className: classNames("widget-text-box-search", this.props.class),
                ref: widgetDom => this.widgetDom = widgetDom,
                style: SharedUtils.parseStyle(this.props.style)
            },
            this.renderButtonOrLink()
        );
    }

    componentDidMount() {
        SharedUtils.delay(this.connectToListView.bind(this), this.checkListViewAvailable.bind(this), 20);
        this.listViewAction = this.listViewAction.bind(this)
        console.dir (this)
    }


    private listViewAction (dataSourceHelper:DataSourceHelper|undefined, microflow:string) {
            console.dir (dataSourceHelper)
            console.dir (this)
            if (dataSourceHelper === undefined) {
                return
            }
            const listView = dataSourceHelper.getListView()!
            const objs = listView._datasource as any
            const items: Array<ListObject> = objs["_pageObjs"]

            const guids:  Array<string> = items.map (item=> (item._guid))
            var progressId = window.mx.ui.showProgress("Exporting data", true);

            mx.data.action({
                params: {
                    applyto: "selection",
                    actionname: microflow,
                    guids: guids
                },
                origin: undefined,
                callback: function() {
                    window.mx.ui.hideProgress(progressId);
                },
                error: function(error) {
                    alert(error.message);
                    window.mx.ui.hideProgress(progressId);
                }
            });
    }

    private checkListViewAvailable(): boolean {
        if (!this.widgetDom) {
            return false;
        }
        this.retriesFind++;
        if (this.retriesFind > 25) {
            return true; // Give-up searching
        }

        return !!SharedContainerUtils.findTargetListView(this.widgetDom.parentElement, this.props.entity);
    }

    private renderButtonOrLink(): ReactNode {

        if (this.props.btn) {
            return <Button  onClick={this.listViewAction}
                            dataSourceHelper = {this.dataSourceHelper}
                            microflow = {this.props.microflow}
                            btnText = {this.props.btnText}
                            btnGlyph = {this.props.btnGlyph}
                            />
            }
        else {
            return <Link  onClick={this.listViewAction}
                        dataSourceHelper = {this.dataSourceHelper}
                        microflow = {this.props.microflow}
                        btnText = {this.props.btnText}
                        btnGlyph = {this.props.btnGlyph}
                        />
        }
        }


    private connectToListView() {
        let alertMessage = "";

        try {
            this.dataSourceHelper = DataSourceHelper.getInstance(this.widgetDom, this.props.entity);
        } catch (error) {
            alertMessage = error.message;
        }

        this.setState({
            alertMessage: alertMessage || Validate.validateProps(),
            listViewAvailable: !alertMessage
        });
    }


}
